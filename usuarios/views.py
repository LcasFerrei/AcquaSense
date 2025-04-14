# views.py
from django.shortcuts import redirect
from django.db import IntegrityError, transaction
from django.utils.deprecation import MiddlewareMixin
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
from rest_framework.parsers import JSONParser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from usuarios.models import CustomUser  # Importando o CustomUser
import json
from residences.models import Residencia
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        with transaction.atomic():
            print("Recebendo request do mobile")
            print(request.headers)
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')

            print(request.data)

            if not username or not password or not email:
                return Response({'error': 'Todos os campos são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
            print("Passsou 1")
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
            print("Passsou 2")

            try:
                if User.objects.filter(username=username).exists():
                    return Response({'error': 'Usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)

                CustomUser.objects.create_user(email=email, password=password, first_name=username, last_name='')
                User.objects.create_user(username=username, email=email, password=password, first_name=username, last_name='')

            except IntegrityError:
                return Response({'error': 'Erro ao criar o usuário. Tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)
            print("Passsou 3")

            authenticated_user = authenticate(request, email=email, password=password)

            print("Passsou 4")
            print(authenticated_user)

            if authenticated_user is not None:
                login(request, authenticated_user)
                print("Passsou 5")
                return Response({'message': 'Login bem-sucedido.'}, status=status.HTTP_201_CREATED)

            return Response({'error': 'Erro ao autenticar o usuário.'}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message': 'Login bem-sucedido.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)
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