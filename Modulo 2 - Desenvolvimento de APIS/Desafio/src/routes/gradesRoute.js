import express from 'express';
import { promises } from 'fs';
import cors from 'cors';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
  let grade = req.body;
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    grade = {
      id: json.nextId++,
      ...grade,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(grade);

    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grade - ${err.message}`);
  }
});

router.get('/', cors(), async (_, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    logger.info('GET /grade');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade - ${err.message}`);
  }
});

router.get('/totalSum', cors(), async (req, res) => {
  try {
    const subject = req.query.subject;
    const student = req.query.student;

    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    const totalSum = json.grades
      .filter((grade) => {
        return grade.subject === subject && grade.student === student;
      })
      .reduce((acum, grade) => {
        return acum + grade.value;
      }, 0);
    const formattedResponse = { totalSum: totalSum };
    res.send(formattedResponse);
    logger.info('GET /grade');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade - ${err.message}`);
  }
});

router.get('/average', cors(), async (req, res) => {
  try {
    const subject = req.query.subject;
    const type = req.query.type;

    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    const filteredGrades = json.grades.filter((grade) => {
      return grade.subject === subject && grade.type === type;
    });

    const totalSum = filteredGrades.reduce((acum, grade) => {
      return acum + grade.value;
    }, 0);
    const formattedResponse = {
      averageGrade: totalSum / filteredGrades.length,
    };
    res.send(formattedResponse);
    logger.info('GET /grade');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade - ${err.message}`);
  }
});

router.get('/topThreeGrades', cors(), async (req, res) => {
  try {
    const subject = req.query.subject;
    const type = req.query.type;

    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    const topThreeGrades = json.grades
      .filter((grade) => {
        return grade.subject === subject && grade.type === type;
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    const formattedResponse = { topThreeGrades: topThreeGrades };
    res.send(formattedResponse);
    logger.info('GET /grade');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade - ${err.message}`);
  }
});

router.get('/:id', cors(), async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const grade = json.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );
    if (grade) {
      res.send(grade);
      logger.info(`GET /grade/:id - ${JSON.stringify(grade)}`);
    } else {
      res.end();
      logger.info('POST /grade/:id');
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade/:id - ${err.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let grades = json.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );
    json.grades = grades;

    await writeFile(global.fileName, JSON.stringify(json));

    res.status(204).end();

    logger.info(`DELETE /grade/:id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /grade - ${err.message}`);
  }
});

router.put('/:id', async (req, res) => {
  try {
    let newGrade = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.grades.findIndex(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );
    json.grades[oldIndex].student = newGrade.student;
    json.grades[oldIndex].subject = newGrade.subject;
    json.grades[oldIndex].type = newGrade.type;
    json.grades[oldIndex].value = newGrade.value;
    json.grades[oldIndex].updatedAt = new Date().toISOString();

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(json.grades[oldIndex]);

    logger.info(`PUT /grade - ${JSON.stringify(newGrade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /grade - ${err.message}`);
  }
});

export default router;
