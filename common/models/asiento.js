"use strict";

module.exports = function (Asiento) {
  Asiento.consultar = (where, order, cb) => {
    const ds = Asiento.app.dataSources.SQLServerContinuo.connector;
    let query =
      `select S.*, P.Nombre as proveedorNombre from Solicitudes_Cheques S\
    inner join Proveedores P on (P.Id = S.Proveedor)` +
      (where !== undefined ? ` where ${where}` : ``) +
      (order !== undefined ? ` order by ${order}` : ``);

    ds.query(query, [], async (error, data) => {
      if (error) cb(error);
      else {
        if (data) {
          let copiaData = data;

          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            await new Promise((resolve) => {
              let query2 = `SELECT * FROM ASIENTO WHERE ID_CHEQUE = ${element.Id}`;

              ds.query(query2, [], (error2, data2) => {
                if (error2) cb(error2);
                else {
                  if (data2.length) {
                    resolve((copiaData[i].asiento = data2));
                  } else {
                    resolve();
                  }
                }
              });
            });
          }
          cb(null, copiaData);
        } else {
          cb(null, []);
        }
      }
    });
  };

  Asiento.remoteMethod("consultar", {
    accepts: [
      { arg: "where", type: "string", required: false },
      { arg: "order", type: "string" },
    ],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Asiento.crear = (object, cb) => {
    const ds = Asiento.app.dataSources.SQLServerContinuo.connector;

    let comprobar = `SELECT * FROM ASIENTO WHERE ID_CHEQUE = ${object.Id}`;

    ds.query(comprobar, [], async (error, data) => {
      if (error) cb(error);
      else {
        if (data.length) {
          cb("Ya existe un asiento");
        } else {
          new Promise((resolve, reject) => {
            let query = `insert into ASIENTO (Id_Cheque, Cuenta, Fecha, Debito, Credito)\
            values (${object.Id},'${object.Cuenta_Banco}','${object.Fecha_Registo}', 0, ${object.Monto})`;

            ds.query(query, [], async (error, data) => {
              if (error) reject(error);
              else {
                resolve(data);
              }
            });
          })
            .then(() => {
              let query2 = `insert into ASIENTO (Id_Cheque, Cuenta, Fecha, Debito, Credito)\
            values (${object.Id},'${object.Cuenta_Proveedor}','${object.Fecha_Registo}', ${object.Monto}, 0)`;

              ds.query(query2, [], async (error) => {
                if (error) throw new Error(error);
                else {
                  cb(null, "Okey");
                }
              });
            })
            .catch((e) => {
              cb(e);
            });
        }
      }
    });
  };

  Asiento.remoteMethod("crear", {
    accepts: [{ arg: "object", type: "object", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });

  Asiento.eliminar = (Id, cb) => {
    const ds = Asiento.app.dataSources.SQLServerContinuo.connector;

    if (Id) {
      let query = `delete from ASIENTO where Id_Cheque = ${Id}`;

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

  Asiento.remoteMethod("eliminar", {
    accepts: [{ arg: "id", type: "number", required: true }],
    returns: { type: "array", root: true },
    http: { verb: "get" },
  });
};
