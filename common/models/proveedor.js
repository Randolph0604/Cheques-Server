"use strict";

module.exports = function (Proveedor) {
  Proveedor.consultar = (where, order, cb) => {
    const ds = Proveedor.app.dataSources.SQLServerContinuo.connector;
    let query =
      `select * from Proveedores` +
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

  Proveedor.remoteMethod("consultar", {
    accepts: [
      { arg: "where", type: "string", required: false },
      { arg: "order", type: "string" },
    ],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Proveedor.crear = (object, cb) => {
    const ds = Proveedor.app.dataSources.SQLServerContinuo.connector;

    if (object.Id) {
      let query = `update Proveedores set 
      Nombre = '${object.Nombre}', 
      Estado = '${object.Estado ? object.Estado : "Activo"}', 
      Balance = ${object.Balance}, 
      Cedula = '${object.Cedula}', 
      Cuenta_Contable = '${object.Cuenta_Contable}', 
      Tipo_Persona = '${object.Tipo_Persona}' 
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
      let query = `insert into Proveedores (Nombre, Estado, Balance, Cedula, Cuenta_Contable, Tipo_Persona) values ('${
        object.Nombre
      }', '${object.Estado ? object.Estado : "Activo"}', ${object.Balance}, '${
        object.Cedula
      }', '${object.Cuenta_Contable}', '${object.Tipo_Persona}')`;

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

  Proveedor.remoteMethod("crear", {
    accepts: [{ arg: "object", type: "object", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Proveedor.eliminar = (Id, cb) => {
    const ds = Proveedor.app.dataSources.SQLServerContinuo.connector;

    if (Id) {
      let query = `delete from Proveedores where id = ${Id}`;

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

  Proveedor.remoteMethod("eliminar", {
    accepts: [{ arg: "id", type: "number", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });
};
