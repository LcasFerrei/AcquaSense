# Generated by Django 5.0.6 on 2024-09-04 23:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_customuser_residencia_pontodeusodeagua_sensordefluxo_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sensordefluxo',
            name='ponto_uso',
        ),
        migrations.RemoveField(
            model_name='registrodeconsumo',
            name='sensor',
        ),
        migrations.RemoveField(
            model_name='residencia',
            name='usuario',
        ),
        migrations.DeleteModel(
            name='PontoDeUsoDeAgua',
        ),
        migrations.DeleteModel(
            name='RegistroDeConsumo',
        ),
        migrations.DeleteModel(
            name='SensorDeFluxo',
        ),
        migrations.DeleteModel(
            name='Residencia',
        ),
    ]
