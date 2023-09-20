import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Status",
      [
        {
          name: "Online"
        },
        {
          name: "Offline"
        },
        {
          name: "Em pausa"
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Status", {});
  }
};
