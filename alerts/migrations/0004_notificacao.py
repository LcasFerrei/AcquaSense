# Generated by Django 5.1.1 on 2024-11-23 21:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0003_initial'),
        ('usuarios', '0004_alter_customuser_options_alter_customuser_managers_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notificacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mensagem', models.TextField()),
                ('data_hora', models.DateTimeField(auto_now_add=True)),
                ('tipo_notificacao', models.CharField(choices=[('INFO', 'Informação'), ('ALERTA', 'Alerta'), ('ERRO', 'Erro')], max_length=50)),
                ('lida', models.BooleanField(default=False)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notificacoes', to='usuarios.customuser')),
            ],
            options={
                'ordering': ['-data_hora'],
            },
        ),
    ]
