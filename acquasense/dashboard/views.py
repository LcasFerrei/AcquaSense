from django.shortcuts import render
from django.contrib.auth.decorators import login_required 

@login_required(login_url='/auth/authentication/')
def dashboard(request):
    return render(request,'index.html')
