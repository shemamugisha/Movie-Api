# Movie Api

Application which lets users set their top 100 movies form Movie Database

# API Endpoints included

### User

- **POST /api/v1/auth/register:** Create an account
- **POST /api/v1/auth/login:** Log into your account
- **GET /api/v1/auth/refresh-token:** refresh token
- **GET /api/v1/auth/logout:** Logout from your account

### Movie

- **POST /api/v1/movie:** Create a movie
- **GET /api/v1/movies/my-list:** retrieving my ranked movie list
- **GET /api/v1/movies/:movieID:** retrieving one movie from my list.
- **GET /api/v1/movies/popular:** retrieving popular movies list from the external database of movies.
- **PATCH /api/v1/movies:movieID:** Update a movie
- **DELETE /api/v1/movies:movieID:** Delete a movie

# [Documentation](https://movieapi-montech.herokuapp.com/docs/swagger-ui/)

# Installation and Environment Setup

**Clone the repository from [Github](https://github.com/shemamugisha/Movie-Api).**

( You will need **Git** for this if you are running a Windows PC, Get it [HERE](https://git-scm.com/) )

```
git clone https://github.com/shemamugisha/Movie-Api
```

**To Install all dependencies:**

```
yarn install
```

**To run the tests:**

```
test:watch
```

**Now to start the app:**

```
yarn start:dev
```

# Tools used

- Server-Side Framework: **NestJs**
- Testing framework: **Jest**
- containerization: **Docker**
- Deployment: **[Heroku](https://www.heroku.com)**

# Author:

**Shema Mugisha Christian**
