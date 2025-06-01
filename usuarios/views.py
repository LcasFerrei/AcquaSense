from django.shortcuts import redirect
from django.db import IntegrityError, transaction
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from usuarios.models import CustomUser  # Importando o CustomUser
import json
from residences.models import Residencia
from django.middleware.csrf import get_token


def clear_csrf(request):
    response = JsonResponse({'status': 'CSRF cookie cleared'})
    response.delete_cookie('csrftoken')
    return response

@ensure_csrf_cookie
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
        
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
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
                    domain='.acquasense.onrender.com',
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
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        try:
            # Parse o corpo da requisição JSON
            data = json.loads(request.body)

            print(data)

            # Obtém o usuário e a residência
            user = CustomUser.objects.filter(email=request.user.email).first()
            user_2 = User.objects.filter(email=request.user.email).first()

            print(user)
            print(user_2)
            residencia = Residencia.objects.filter(usuario=user).first()

            # Atualiza os dados do usuário
            user.first_name = data.get("first_name", user.first_name)
            user_2.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user_2.last_name = data.get("last_name", user.last_name)
            user.phone_number = data.get("phone", user.phone_number)
            user.email = data.get("email", user.email)
            user_2.email = data.get("email", user.email)

            # Atualiza ou cria a residência
            if residencia:
                residencia.endereco = data.get("address", residencia.endereco)
                residencia.save()
            else:
                # Cria uma nova residência com os dados fornecidos
                Residencia.objects.create(
                    nome=data.get("name", ""),
                    endereco=data.get("address", ""),
                    usuario=user
                )

            user.save()
            user_2.save()

            return Response({"message": "Perfil atualizado com sucesso!"}, status=200)
        except json.JSONDecodeError:
            return Response({"message": "Erro ao processar os dados."}, status=400)

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
def logout_view(request):
    logout(request)
    response = JsonResponse({'success': True})
    response.delete_cookie('sessionid', domain='.acquasense.onrender.com')
    response.delete_cookie('csrftoken', domain='.acquasense.onrender.com')
    return response