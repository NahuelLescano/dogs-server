const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'Dog',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          'https://www.cnet.com/a/img/resize/20d6844768bd3f5f0df41deee97897423bcaf3c5/hub/2021/11/03/3c2a7d79-770e-4cfa-9847-66b3901fb5d7/c09.jpg?auto=webp&fit=crop&height=1200&width=1200',
        validate: {
          is: /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/i,
          isUrl: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([a-zA-Z ]+)$/,
          notNull: { msg: 'Cannot be null' },
          notEmpty: true,
        },
      },
      height: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: 'Cannot be null' },
        },
      },
      weight: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: 'Cannot be null' },
        },
      },
      life_span: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([a-zA-Z0-9 -_ ]+)$/,
          notNull: { msg: 'Cannot be null' },
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
