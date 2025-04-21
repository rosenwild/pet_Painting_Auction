# Fast_api-pet-project
Проект на фреймворке FAST_api для реализации популярных технологий и практики программирования

Технологии в проекте:
* Backend: FastApi, Pydantic, UUid, JWT. База данных развертывается с помощью образа PostgreSQL в Docker.
* Frontend: Node.js, React, Axios, JWTdecode.
  
# Демонстрация проекта

## Route list
![](/project_imgs/routes.jpg)

## Schemas
Используются таблицы для регистрации и авторизации пользователей на основе jwt токенов и для хранения информации о картинах 

![](/project_imgs/schemas1.jpg)

![](/project_imgs/schemas2.jpg)

![](/project_imgs/schemas3.jpg)

## Homepage
![](/project_imgs/homepage.jpg)

## Auth&Login pages
Страницы регистрации и авторизации позволяют пользователям получить роли, которые увеличивают функционал приложения

![](/project_imgs/register.jpg)
![](/project_imgs/login.jpg)

## Painting
После авторизации по роли админа можно удалять картины, переназначать им цену и добавлять новые

![](/project_imgs/newpainting.jpg)

![](/project_imgs/paintingItem.jpg)
