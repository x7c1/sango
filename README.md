# Sango

[![build status](https://img.shields.io/travis/x7c1/sango/master.svg?style=flat-square)](https://travis-ci.org/x7c1/sango)
[![npm](https://img.shields.io/npm/v/sango.svg?style=flat-square)](https://www.npmjs.com/package/sango)

Functions to generate OpenAPI YAML file.

## Install

```
npm install sango
```

## Usage

1) Create yaml files like following [example-petstore](./projects/example-petstore) project:

```
projects/example-petstore
├── components
│   └── schemas
│       ├── Error.yaml
│       ├── Pet.yaml
│       ├── Pets.yaml
│       └── User.yaml
├── info
│   └── index.yaml
└── paths
    ├── pets
    │   ├── create.yaml
    │   ├── index.yaml
    │   └── show.yaml
    └── users
        └── show.yaml
```

2) Create template file according to OpenAPI Specification.

```
$ cat projects/example-petstore/index.template.yaml
openapi: 3.0.0
info:
  $ref: ./info/index.yaml
paths:
  $ref: ./paths/index.gen.yaml
components:
  schemas:
    $ref: ./components/schemas.gen.yaml
```

3) Combine them:

```ts
Runner
  .run([
    write({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas"),
    }),
    write({
      outputPath: "./paths/index.gen.yaml",
      traverser: traverseYamls("./paths"),
    }),
  ])
  .then(resolve("./index.template.yaml").and(validate))
  .then(output("./dist/index.gen.yaml"))
  .catch(err => {
    console.error("[index.ts] unexpected error:", err)
    process.exit(1)
  })
```

<details>
<summary>Output : projects/example-petstore/dist/index.gen.yaml</summary>

```
$ cat projects/example-petstore/dist/index.gen.yaml
openapi: 3.0.0
info:
  version: 0.0.1
  title: Petstore Example
paths:
  /pets:
    post:
      summary: Create a pet
      operationId: createPets
      tags:
        - pets
      responses:
        '201':
          description: Null response
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - pets
      parameters:
        - name: limit
          in: query
          description: How many items to return at one time (max 100)
          required: false
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: A paged array of pets
          headers:
            x-next:
              description: A link to the next page of responses
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  '/pets/{petId}':
    get:
      summary: Info for a specific pet
      operationId: showPetById
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          description: The id of the pet to retrieve
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  '/users/{userId}':
    get:
      summary: Info for a specific user
      tags:
        - users
      parameters:
        - name: userId
          in: path
          required: true
          description: The id of the user to retrieve
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Users'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Error:
      required:
        - code
        - message
      properties:
        code:
          type: integer
          format: int32
        message:
          type: string
    Pet:
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
    User:
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
```

</details>

## License

This repository is published under the MIT License.
