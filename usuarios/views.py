# views.py
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
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Usuário e senha são obrigatórios."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Nome de usuário já existe."}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"success": True, "message": "Usuário criado com sucesso."}, status=201)
        
def login_view(request):
    if request.method == 'POST':
        print("Origin Header:", request.headers.get('Origin'))
        print("Host Header:", request.headers.get('Host'))
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            response = JsonResponse({'success': True})
            response.set_cookie(
                'sessionid',
                request.session.session_key,
                domain='127.0.0.1',  # Adicione isso
                samesite='Lax',      # Mude de 'None' para 'Lax' para desenvolvimento local
                secure=False,
                httponly=True,
                max_age=86400        # Define tempo de expiração (opcional)
            )
            # Headers CORS OBRIGATÓRIOS
            response['Access-Control-Allow-Origin'] = request.headers['Origin']
            response['Access-Control-Allow-Credentials'] = 'true'
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
            "name": f"{user.first_name} {user.last_name}",
            "address": endereco,  # Pega o endereço da residência
            "phone": user.phone_number if user.phone_number else "Não cadastrado",  # Verifica se o telefone existe
            "email": user.email,
        }

        return Response(data)
    
@login_required
def user_profile_edit(request):
    if request.method == 'POST':
        try:
            # Parse o corpo da requisição JSON
            data = json.loads(request.body)

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

            print(user.email)
            print(user_2.email)

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

            return JsonResponse({"message": "Perfil atualizado com sucesso!"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Erro ao processar os dados."}, status=400)
    return JsonResponse({"message": "Método inválido"}, status=400)

@login_required()
def check_auth(request):
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
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Usuário deslogado com sucesso"})