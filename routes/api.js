import express from 'express';
import controllers from '../controllers';

const router = express.Router();

router.get('/:resource/', (req, res) => {
  const { resource } = req.params;
  const controller = controllers[resource];

  if (!controller) {
    res.json({
      confirmation: 'fail',
      message: `Requested resource '${resource}' is not available`,
    });

    return;
  }

  controller.get(req.query, false)
    .then((results) => {
      res.json({
        confirmation: 'success',
        results,
      });
    })
    .catch((err) => {
      res.json({
        confirmation: 'fail',
        message: err,
      });
    });
});

router.get('/:resource/:id', (req, res) => {
  const { resource, id } = req.params;
  const controller = controllers[resource];

  if (!controller) {
    res.json({
      confirmation: 'fail',
      message: `Requested resource '${resource}' is not available`,
    });

    return;
  }

  controller.getById(id, false)
    .then((result) => {
      res.json({
        confirmation: 'success',
        result,
      });
    })
    .catch(() => {
      // Default mongoose error for a bad findById query is non-descriptive
      res.json({
        confirmation: 'fail',
        message: `${resource} with id ${id} was not found!`,
      });
    });
});

router.post('/:resource', (req, res) => {
  const { resource } = req.params;
  const controller = controllers[resource];

  if (!controller) {
    res.json({
      confirmation: 'fail',
      message: `Requested resource '${resource}' is not available`,
    });

    return;
  }

  controller.create(req.body, false)
    .then((result) => {
      res.json({
        confirmation: 'success',
        result,
      });
    })
    .catch((err) => {
      res.json({
        confirmation: 'fail',
        message: err,
      });
    });
});

export default router;
