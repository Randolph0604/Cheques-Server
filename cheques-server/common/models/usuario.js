"use strict";

module.exports = function (Usuario) {
  Usuario.consultar = (where, order, cb) => {
    const ds = Usuario.app.dataSources.SQLServerContinuo.connector;
    let query =
      `select * from Usuarios` +
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

  Usuario.remoteMethod("consultar", {
    accepts: [
      { arg: "where", type: "string", required: false },
      { arg: "order", type: "string" },
    ],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Usuario.crear = (object, cb) => {
    const ds = Usuario.app.dataSources.SQLServerContinuo.connector;

    if (object.Id) {
      let query = `update Usuarios set \
      Usuario = '${object.Usuario}',\
      Pass = '${object.Pass}',\
      Tipo = ${object.Tipo}\
      where id = ${object.Id}`;

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
      let query = `insert into Usuarios (Usuario, Pass, Tipo)\
      values ('${object.Usuario}','${object.Pass}',${object.Tipo})`;

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

  Usuario.remoteMethod("crear", {
    accepts: [{ arg: "object", type: "object", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Usuario.eliminar = (Id, cb) => {
    const ds = Usuario.app.dataSources.SQLServerContinuo.connector;

    if (Id) {
      let query = `delete from Usuarios where id = ${Id}`;

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

  Usuario.remoteMethod("eliminar", {
    accepts: [{ arg: "id", type: "number", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });
};
