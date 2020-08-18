const express = require('express');
const bodyParser = require('body-parser')
const { request, response } = require('express');
const { uuid } = require('uuidv4');

const app = express();
app.use(bodyParser.json());

const projects = [];

//curl -X GET http://localhost:3333/projects
app.get('/projects', (request, response) => {
  const { name } = request.query;

  const results = name
    ? projects.filter(project => project.name.includes(name))
    : projects;

  return response.status(200).json(results);
});

//curl -X POST http://localhost:3333/projects -d '{ "project": { "name": "Project 03 created" } }' -H "Content-Type: application/json;charset=utf-8"
app.post('/projects', (request, response) => {
  const { name, owner } = request.body;
  const project = { id: uuid(), name, owner };
  projects.push(project);
  return response.status(201).json(project);
});

//curl -X PUT http://localhost:3333/projects/1 -d '{ "project": { "name": "Project 02 updated" } }' -H "Content-Type: application/json;charset=utf-8"
app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { name, owner } = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({ error: "project not found " });
  }

  const project = { id, name, owner };
  projects[projectIndex] = project;
  return response.status(204).json(project);
})

//curl -X DELETE http://localhost:3333/projects/1
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({ error: "project not found " });
  }
  projects.splice(projectIndex, 1);

  return response.sendStatus(204);
})

app.listen(3333, () => {
  console.log("🚀Back-end started!");
});
