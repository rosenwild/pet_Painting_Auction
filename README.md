# Fast_api-pet-project
Проект на фреймворке FAST_api для реализации популярных технологий и практики программирования

Технологии в проекте:
* Backend: FastApi, Pydantic, UUid, JWT. База данных развертывается с помощью образа PostgreSQL в Docker.
* Frontend: Node.js, React, Axios, JWTdecode.
  
# Демонстрация проекта

## Route list
![](/project_imgs/routes.png)

## Schemas
Используются таблицы для регистрации и авторизации пользователей на основе jwt токенов и для хранения информации о картинах 

![](/project_imgs/Schemas.png)

## Homepage
![](/project_imgs/homepage.png)

## Auth&Login pages
Страницы регистрации и авторизации позволяют пользователям получить роли, которые увеличивают функционал приложения

![](/project_imgs/auth_page.png)
![](/project_imgs/login_page.png)

## Painting
После авторизации по роли админа можно удалять картины, переназначать им цену и добавлять новые

![](/project_imgs/price.png)

![](/project_imgs/new_painting.png)