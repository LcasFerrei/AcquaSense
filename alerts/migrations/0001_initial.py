# Generated by Django 5.0.6 on 2024-09-04 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AlertaConsumo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mensagem', models.TextField()),
                ('data_hora', models.DateTimeField(auto_now_add=True)),
                ('tipo_alerta', models.CharField(choices=[('MÉDIO', 'Consumo quase excessivo'), ('EXCESSIVO', 'Consumo Excessivo')], max_length=50)),
            ],
        ),
    ]
