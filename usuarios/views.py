from django.db import IntegrityError, transaction
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from usuarios.models import CustomUser  # Importando o CustomUser
import json
from residences.models import Residencia


def clear_csrf(request):
    response = JsonResponse({'status': 'CSRF cookie cleared'})
    print(response)
    response.delete_cookie('csrftoken')
    return response

@csrf_exempt
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    phone = request.data.get('phone')
    password = request.data.get('password')

    print(request.data)
    print({'username':username,'email':email,'password':password,
           'first_name':first_name,'last_name':last_name, 'phone':phone})

    if not username or not password:
        return Response({"error": "Usuário e senha são obrigatórios."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Nome de usuário já existe."}, status=400)

    with transaction.atomic():
        User.objects.create_user(username=username, email=email,first_name=first_name,
                                        last_name=last_name, password=password)
        
        CustomUser.objects.create(email=email,first_name=first_name,
                                        last_name=last_name, password=password, phone_number=phone)
    return Response({"success": True, "message": "Usuário criado com sucesso."}, status=201)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # ⬅️ Adicione esta linha
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            
            # Verifica se é uma requisição do React Native (por cabeçalho ou parâmetro)
            is_native_app = request.headers.get('X-Requested-With') == 'ReactNative' or 'native' in request.GET
            
            if is_native_app:
                # Gera tokens JWT para o app nativo
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'success': True,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                })
            else:
                # Autenticação tradicional com sessão/cookie para web
                response = JsonResponse({'success': True})
                response.set_cookie(
                    'sessionid',
                    request.session.session_key,
                    domain='acquasense.onrender.com',
                    secure=True,
                    samesite='None',
                    max_age=1209600  # 2 semanas
                )
                return response
                
    return JsonResponse({'error': 'Login failed'}, status=401)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obter informações do usuário autenticado
        user = CustomUser.objects.filter(email=request.user.email).first()  # Obter usuário
        print(user)
        if not user:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)  # Verifica se o usuário existe
        
        residencia = Residencia.objects.filter(usuario=user).first()  # Obter residência do usuário
        if residencia:
            endereco = residencia.endereco
        else:
            endereco = "Não cadastrado"
        
        # Preparar os dados de resposta
        data = {
            "name": {user.first_name},
            "last_name": {user.last_name},
            "address": endereco,  # Pega o endereço da residência
            "phone": user.phone_number if user.phone_number else "Não cadastrado",  # Verifica se o telefone existe
            "email": user.email,
        }

        return Response(data)
    
class UserProfileViewEdit(APIView):
    permission_classes = [IsAuthenticated]  # Changed from AllowAny

    def patch(self, request):
        try:
            # No need for json.loads() - DRF already parses the JSON
            data = request.data
            
            print("Received data:", data)

            # Get user objects
            user = CustomUser.objects.filter(email=request.user.email).first()
            user_2 = User.objects.filter(username=request.user.username).first()

            if not user or not user_2:
                return Response({"message": "User not found"}, status=404)

            # Update user data
            if "first_name" in data:
                user.first_name = user_2.first_name = data["first_name"]
            if "last_name" in data:
                user.last_name = user_2.last_name = data["last_name"]
            if "phone" in data:
                user.phone_number = data["phone"]
            if "email" in data:
                new_email = data["email"]
                if User.objects.exclude(pk=user_2.pk).filter(email=new_email).exists():
                    return Response({"message": "Email already in use"}, status=400)
                user.email = user_2.email = new_email

            # Update or create residence
            residencia, created = Residencia.objects.get_or_create(
                usuario=user,
                defaults={
                    'nome': data.get("name", ""),
                    'endereco': data.get("address", "")
                }
            )
            
            if not created and "address" in data:
                residencia.endereco = data["address"]
                residencia.save()

            user.save()
            user_2.save()

            return Response({"message": "Profile updated successfully!"}, status=200)
            
        except Exception as e:
            print("Error:", str(e))
            return Response({"message": "An error occurred"}, status=400)

def check_auth_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False}, status=401)
    return JsonResponse({'authenticated': True})

@api_view(['GET'])
@login_required()
def get_username(request):
    return Response({'username': request.user.username}) 

@api_view(['GET'])
def config(request):
    data = {
        "news": "Após a criação do AcquaSense, tivemos uma redução em média de 20% no consumo de água nas condomínios que faturamos.",
        "daily_consumption": "108 Litros",
        "pipes_status": "Normal",
        "daily_goal": "120 Litros",
        "accumulated_consumption": "540 Litros"
    }
    print("Campo de config")
    return Response(data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # ⬅️ Adicione esta linha
def logout_view(request):
    logout(request)
    response = JsonResponse({'success': True})
    response.delete_cookie('sessionid', domain='acquasense.onrender.com')
    response.delete_cookie('csrftoken', domain='acquasense.onrender.com')
    return response