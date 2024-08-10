from django.http.response import HttpResponse
from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout as logout_django
from django.contrib import messages

def authentication(request):
    if request.method == 'GET':
        return render(request,'autenticacao.html')
    else:
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(username=username,password=password)

        if user is not None and user.is_active:
            login(request,user)
            return redirect('dashboard')
        else:
            messages.warning(request,'Algo deu errado. Preecha os dados corretamente')
            return redirect('authentication')

def logout(request):

    logout_django(request)
    return render(request,'autenticacao.html')

def cadastrar(request):
    if request.method == 'GET':
        return redirect(request,'autenticacao.html')
    else: 
        username = request.POST.get('usernameRegister')
        email = request.POST.get('emailRegister')
        password = request.POST.get('passwordRegister')
        try:
            user = User.objects.get(username=username)
        except:
            user = False

        if user:
            messages.warning(request,'Usuário já existe')
            return redirect('authentication')
        
        user = User.objects.create_user(username=username,email=email,password=password)
        user.save()
        login(request,user)

        return redirect('dashboard')

    