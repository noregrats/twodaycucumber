module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["features/step_definitions/**/*.ts"],
    format: ["@cucumber/pretty-formatter"]
  }
};
