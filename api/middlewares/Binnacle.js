// ===================== Importaciones =====================
const { Binnacle, models } = require('../models');


async function BitacoraMiddleware(req, res) {
    //res.on('finish', async () => {   //esto se va usar para hacerlo de otra manera en caso de que se quiera
    try {
        //acordions
        const method = req.method.toLowerCase();
        const table = req.table;
        const facts = req.facts || {};
        const old_value = req.old_value || {};
        const result = req.result || {};

        console.log(req.user.id)

        const filtered = Object.fromEntries(
            Object.entries(old_value).filter(([key]) => 
                facts && Object.keys(facts).includes(key)
            )
        );
        

        let payload = {
            responsible_id: req.user.id,
            table: table,
            created_at: new Date(),
            action: method
        };
 
        payload.entity_id = (
            method == "post" || method == "delete"
                ? facts.id
                : method == "put"
                    ? old_value.id
                    : result.id
        )

        payload.facts = Object.keys(facts).length === 0
            ? JSON.stringify(Object.keys(result))
            : JSON.stringify(Object.keys(facts));

        payload.old_value = (
            method == "put"
                ? JSON.stringify(filtered)
                : method == "delete"
                    ? JSON.stringify(facts)
                    : null
        )

        payload.new_value = (
            method === "put" || method === "post"
                ? JSON.stringify(facts)
                : method === "get"
                    ? JSON.stringify(result)
                    : null
        );

        await Binnacle.create(payload);
        console.log("Insercion en bitacora exitosa");

        return res.json(result);

    } catch (err) {
        console.error("Error en bitácora:", err);
        return res.status(500).json({ message: 'Error al registrar bitácora', error: err.message });
    }
}
//)}
async function Prepare_bitacora(req, res, next) {
    const table_name = req.table;
    const method = req.method.toLowerCase();
    const create = req.create; //Este valor lo manda despues el controlador POST ya que prepare va despues
    const { idD } = req.params || {};
    const { idU } = req.body || {};

    const model = models[table_name];
    if (!model) return res.json({ message: `No existe el modelo Sequelize '${model}'` });

    let facts;
    let verif =
        method === "delete"
            ? idD
            : method === "put"
                ? (idU || req.user.id)
                : null;


    if (verif) {
        const record = await model.findByPk(verif);
        if (!record) return res.json({ message: `Registro no encontrado en '${modelName}' con ID ${verif}` });
        
        
        if(method == "put"){
            req.old_value = record.toJSON();
            req.verif = verif;
        }
        else facts = record.toJSON();
    }

    if (method == "post") {
        facts = create.toJSON();
    }

    req.facts = facts || {};
    next();
}

// ===================== Exportaciones =====================
module.exports = {
    BitacoraMiddleware,
    Prepare_bitacora
}