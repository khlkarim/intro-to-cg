# Workshop – Introduction to Computer Graphics

This repo has the following structure:

```bash
project/
    final/      # The final version of our project that we will take as reference.
    template/   # The starter version of our project that we will build on top of.
slides/         # The presentation slides for the workshop.
```

Each of the above is deployed separately at the following links:

* [Slides](https://slides-intro-to-cg.vercel.app)
* [Final Project](https://final-project-intro-to-cg.vercel.app)
* [Template Project](https://template-project-intro-to-cg.vercel.app)

---

Before attending the workshop, you should clone this repo and make sure it works locally.
Run the following commands:

```bash
git clone git@github.com:khlkarim/intro-to-cg.git
cd intro-to-cg/project/final   # or intro-to-cg/project/template or intro-to-cg/slides
npm install
npm run dev
```

If you encounter any issues while trying to run the project, feel free to contact me.

---

The workshop is split into two parts:

1. **Mesh Generation**
   We will define what a mesh is, and then try to procedurally generate our own generic meshes (planes, spheres, cubes...).

2. **Water Surface Generation**
   We will learn what shaders are and how to write a shader program that creates interesting visuals.

---

### Prerequisites

#### 1. TypeScript

If you are familiar with JavaScript but not TypeScript, reading [this article](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) should get you up to speed.

We will be writing the code in TypeScript, but we won't need any advanced language constructs.
The code we will write won't be any more complex than the content of these files, so make sure to go through them and understand what they do:

```bash
project/template/index.html
project/template/src/main.ts
project/template/src/helpers/input.ts
```

#### 2. Linear Algebra

We won't be doing any heavy math or constructing any matrices, but understanding these concepts will come in handy:

* What multiplying a vector by a matrix does.
* What is a basis of a vector space and what is a change of basis.
* What the dot product of two vectors is.

---

There is a lot of improvement that can be done to this project, from code refactoring to adding new features. So after the workshop ends, I will try to add a list of features to this README and your contributions would be very appreciated. Anyways, see you there ;)