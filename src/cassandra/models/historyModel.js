module.exports = {
    fields: {
        tenant: "uuid",
        contact: "uuid",
        mean_contact: "text",
        client_id:"text",
        origin: "text",
        context: "text",
        status: "boolean",
        created: {
            type: "timestamp",
            default: {"$db_function": "toTimestamp(now())"}
        }
    },
    key : [["tenant", "contact"], "created", "status"],
    table_name: "history",
}