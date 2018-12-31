# Sango

Functions to generate OpenAPI YAML file.

## Install

```
npm install sango
```

## Usage

1) Create yaml files like following [example-petstore](./projects/example-petstore/index.ts) project:

```
projects/example-petstore
├── components
│   └── schemas
│       ├── Error.yaml
│       ├── Pet.yaml
│       ├── Pets.yaml
│       └── User.yaml
├── index.template.yaml
├── index.ts
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

3) Combine them :

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

## Lincense

This repository is published under the MIT License.
