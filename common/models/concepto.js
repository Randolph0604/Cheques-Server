"use strict";

module.exports = function (Concepto) {
  Concepto.consultar = (where, order, cb) => {
    const ds = Concepto.app.dataSources.SQLServerContinuo.connector;
    let query =
      `select * from conceptos` +
      (where !== undefined ? ` where ${where}` : ``) +
      (order !== undefined ? ` order by ${order}` : ``);

    ds.query(query, [], async (error, data) => {
      if (error) cb(error);
      else {
        try {
          cb(null, data);
        } catch (err) {
          cb(err);
        }
      }
    });
  };

  Concepto.remoteMethod("consultar", {
    accepts: [
      { arg: "where", type: "string", required: false },
      { arg: "order", type: "string" },
    ],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Concepto.crear = (object, cb) => {
    const ds = Concepto.app.dataSources.SQLServerContinuo.connector;

    if (object.Id) {
      let query = `update Conceptos set Descripcion = '${
        object.Descripcion
      }', Estado = '${object.Estado ? object.Estado : "Activo"}' where id = ${
        object.Id
      }`;

      ds.query(query, [], async (error, data) => {
        if (error) cb(error);
        else {
          try {
            cb(null, data);
          } catch (err) {
            cb(err);
          }
        }
      });
    } else {
      let query = `insert into Conceptos (Descripcion, Estado) values ('${
        object.Descripcion
      }', '${object.Estado ? object.Estado : "Activo"}')`;

      ds.query(query, [], async (error, data) => {
        if (error) cb(error);
        else {
          try {
            cb(null, data);
          } catch (err) {
            cb(err);
          }
        }
      });
    }
  };

  Concepto.remoteMethod("crear", {
    accepts: [{ arg: "object", type: "object", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Concepto.eliminar = (Id, cb) => {
    const ds = Concepto.app.dataSources.SQLServerContinuo.connector;

    if (Id) {
      let query = `delete from Conceptos where id = ${Id}`;

      ds.query(query, [], async (error, data) => {
        if (error) cb(error);
        else {
          try {
            cb(null, data);
          } catch (err) {
            cb(err);
          }
        }
      });
    } else {
      cb("Se necesita un ID para poder eliminar");
    }
  };

  Concepto.remoteMethod("eliminar", {
    accepts: [{ arg: "id", type: "number", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });
};
