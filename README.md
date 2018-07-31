# Матрица компетенции
Приложение создано с целью знакомства со следующим стеком технологий:
- node.js
- mongodb (mongoose)
- vue.js (vuetify)

## Предварительные действия
Для запуска приложения необходимо заранее установить:
- [node.js](https://nodejs.org/en/)
- [mongodb](https://www.mongodb.com/download-center?jmp=nav#community)

**Примечание:** для правильной работы bat файлов база данных (mongodb) должна быть установлена на диск C.
Общий пусть для запуска базы должен быть равен `C:/mongodb/bin/mongod`

## Сборка
### Сервисы
Для каждого сервиса, расположенных в папке ***./services***
``` bash
# установка зависимостей
npm install

# запуск сервиса
gulp

# запуск всех тестов
npm test
```

### Приложение
``` bash
# установка зависимостей
npm install

# запуск с "горячим" конфигурированием на localhost:8080 
npm run dev

# сборка для деплоя
npm run build

# сборка с аналитическим отчетом
npm run build --report

# запуск тестов е2е
npm run e2e

# запуск всех тестов
npm test
```
## Автоматическая сборка
Собирать приложение также можно с помощью bat файлов `dev` и `devapp`, лежащих в папке ***./run***.
