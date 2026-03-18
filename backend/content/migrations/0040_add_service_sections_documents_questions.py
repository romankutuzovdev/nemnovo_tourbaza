# Service: parent, is_active, needs_questionnaire, ServiceQuestion, ServiceDocument, ServiceQuestionnaireSubmission

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0039_add_about_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='parent',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='children',
                to='content.service',
                verbose_name='Родительский раздел',
                help_text='Оставьте пустым для корневого раздела. Разделы могут содержать подразделы (children).',
            ),
        ),
        migrations.AddField(
            model_name='service',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активно'),
        ),
        migrations.AddField(
            model_name='service',
            name='needs_questionnaire',
            field=models.BooleanField(
                default=False,
                help_text='Если отмечено, на странице услуги будет форма с вопросами анкеты.',
                verbose_name='Нужна анкета',
            ),
        ),
        migrations.CreateModel(
            name='ServiceQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=500, verbose_name='Текст вопроса')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='content.service')),
            ],
            options={
                'verbose_name': 'Вопрос анкеты',
                'verbose_name_plural': 'Вопросы анкеты',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ServiceDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Название документа')),
                ('file', models.FileField(upload_to='services/documents/', verbose_name='Файл')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='content.service')),
            ],
            options={
                'verbose_name': 'Документ услуги',
                'verbose_name_plural': 'Документы услуг',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ServiceQuestionnaireSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Имя')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('phone', models.CharField(blank=True, max_length=50, verbose_name='Телефон')),
                ('message', models.TextField(blank=True, verbose_name='Сообщение')),
                ('answers', models.JSONField(default=dict, help_text='Словарь {id_вопроса: ответ}', verbose_name='Ответы')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questionnaire_submissions', to='content.service')),
            ],
            options={
                'verbose_name': 'Отправка анкеты',
                'verbose_name_plural': 'Отправки анкет',
                'ordering': ['-created_at'],
            },
        ),
    ]
