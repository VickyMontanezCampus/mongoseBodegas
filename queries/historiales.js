import {conx} from "../db_mg/atlas.js";
import { ObjectId } from "mongodb";


/* {
  "id":31,
  "id_producto":1,
  "cantidad":3,
  "id_bodega_origen":1,
  "id_bodega_destino":2,
  "created_by":1,
  "updated_by":1,
  "created_at": "2023-08-22",
  "updated_at": "2023-08-22"
} */
export async function apptraslado(req, res){
    try {
        const { id_producto, id_bodega_origen, id_bodega_destino, cantidad } = req.body;
        console.log(req.body);
        let db = await conx();
        let inventariosColleccion = db.collection("inventarios");
        let historialesColleccion = db.collection("historiales");

        const origenBodega = await inventariosColleccion.findOne({
            id_producto: id_producto,
            id_bodega: id_bodega_origen,
            cantidad: { $gte: cantidad }
        });
        await inventariosColleccion.updateOne(
            { _id: origenBodega._id },
            { $inc: { cantidad: -cantidad } }
        );

        const destinoBodega = await inventariosColleccion.findOne({
            id_producto: id_producto,
            id_bodega: id_bodega_destino
        });
        
        if (!destinoBodega) {
            await historialesColleccion.insertOne(nuevoHistorial)
            return;
        }
        
        res.send(destinoBodega)
        /* const destinoBodega = await inventariosColleccion.findOne({
            id_producto: id_producto,
            id_bodega: id_bodega_destino,
            cantidad: parseInt(cantidad)
        });

        if (!origenBodega) {
            res.status(400).send({ status: 400, message: "Invalid traslado request" });
            return;
        }

        const nuevaCantidadOrigen = origenBodega.cantidad - cantidad;
        const nuevaCantidadDestino = destinoBodega.cantidad + cantidad;

        await inventariosColleccion.updateOne(
            { id: origenBodega.id_bodega_origen },
            { $set: { cantidad: nuevaCantidadOrigen } }
        );

        await inventariosColleccion.updateOne(
            { id: destinoBodega.id_bodega_destino },
            { $set: { cantidad: nuevaCantidadDestino } }
        );

        const nuevoHistorial = {
            ...req.body,
            created_at: new Date(req.body.created_at),
            updated_at: new Date(req.body.updated_at)
        };

        await historialesColleccion.insertOne(nuevoHistorial);

        res.send({ status: 200, message: "Producto trasladado exitosamente" }); */
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};