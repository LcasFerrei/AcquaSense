# Generated by Django 5.1.1 on 2024-10-06 22:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('residences', '0003_alter_residencia_usuario'),
    ]

    operations = [
        migrations.AddField(
            model_name='pontodeusodeagua',
            name='comodos',
            field=models.CharField(choices=[('COZINHA', 'Cozinha'), ('LAVANDERIA', 'Lavanderia'), ('BANHEIRO', 'Banheiro'), ('QUARTO', 'Quarto'), ('QUINTAL', 'Quintal')], default='COZINHA', max_length=50),
        ),
    ]
