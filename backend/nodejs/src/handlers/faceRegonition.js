import fs from 'fs';

// Import from classes
import { PyProcess } from '../classes/PyProcess.js';

import { createHandler } from '../templates/handler/index.js';

export const FaceRegonitionImageHandler = createHandler(
  "/face_recognition_image",
  function({ Utils }) {
    const pp = new PyProcess();
    return async function(req, res) {
      try {
        let files = req.files;
        let image = files["image"][0];

        // Thực thi file python.
        const data = await pp.exec("FaceRecognition", image.path, req.body["scale-factor"], req.body["min-neighboors"]);

        res.setHeader('Content-Type', 'image/png');

        return res.download(image.path, function(err) {
          if(err) {

          } else {
            // Xóa ảnh.
            fs.unlink(image.path, function(err) {
              if(err) throw err;
              console.log("File in ", image.path, " was deleted.");
            });
          }
        });
      } catch (error) {
        return Utils.RM.responseJSON(
          res,
          500,
          Utils.RM.getResponseMessage(true, undefined, error.message)
        );
      }
    }
  }
);