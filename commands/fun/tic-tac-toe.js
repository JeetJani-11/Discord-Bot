const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tic-tac-toe")
    .setDescription("Play tic-tac-toe With friends!")
    .addUserOption((option) =>
      option
        .setName("against")
        .setDescription("The user you want to play with")
        .setRequired(true)
    ),
  execute: async function (interaction) {
    let ttt11 = new ButtonBuilder()
      .setCustomId("0")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt12 = new ButtonBuilder()
      .setCustomId("1")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt13 = new ButtonBuilder()
      .setCustomId("2")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt21 = new ButtonBuilder()
      .setCustomId("3")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt22 = new ButtonBuilder()
      .setCustomId("4")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt23 = new ButtonBuilder()
      .setCustomId("5")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt31 = new ButtonBuilder()
      .setCustomId("6")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt32 = new ButtonBuilder()
      .setCustomId("7")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    let ttt33 = new ButtonBuilder()
      .setCustomId("8")
      .setLabel(" - ")
      .setStyle(ButtonStyle.Secondary);
    const btnArray = [
      ttt11,
      ttt12,
      ttt13,
      ttt21,
      ttt22,
      ttt23,
      ttt31,
      ttt32,
      ttt33,
    ];
    let row1 = new ActionRowBuilder();
    row1.addComponents(ttt11, ttt12, ttt13);
    let row2 = new ActionRowBuilder();
    row2.addComponents(ttt21, ttt22, ttt23);
    let row3 = new ActionRowBuilder();
    row3.addComponents(ttt31, ttt32, ttt33);
    const playerOne = interaction.user.username;
    const playerTwo = interaction.options._hoistedOptions[0].user.username;
    let currentPlayer = playerOne;
    let gameOver = false;
    let options = ["", "", "", "", "", "", "", "", ""];
    async function updateBox(index) {
      index = index.toString();
      newButton(index);
    }
    const reply = await interaction.reply({
      content: "Tic-Tac-Toe",
      components: [row1, row2, row3],
    });
    try {
      const resp = await reply.createMessageComponentCollector();
      resp.on("collect", async (i) => {
        i.deferUpdate();
        if (i.user.username === currentPlayer) {
          const index = i.customId;
          if (options[index] != "" || gameOver) {
            return;
          }
          await updateBox(index);
          const winner = checkWinner();
          if (!gameOver) {
            await interaction.editReply({ components: [row1, row2, row3] });
          } else if (gameOver) {
            if(winner){
              await interaction.editReply({
                content: `Winner is ${currentPlayer}`,
                components: [],
              });
            }else{
              await interaction.editReply({ content: `Draw`  , components : []});
            } 
          }
        }
      });
    } catch (e) {
      console.log("Error ", e);
    }

    async function newButton(index) {
      for (let row of [row1, row2, row3]) {
        for (let button of row.components) {
          if (button.data.custom_id === index) {
            if (currentPlayer === playerOne) {
              row.components[row.components.indexOf(button)] =
                new ButtonBuilder()
                  .setCustomId(index)
                  .setLabel("X")
                  .setStyle(ButtonStyle.Danger);
              options[Number(index)] = "X";
            } else {
              row.components[row.components.indexOf(button)] =
                new ButtonBuilder()
                  .setCustomId(index)
                  .setLabel("O")
                  .setStyle(ButtonStyle.Primary);
              options[Number(index)] = "O";
            }
            break;
          }
        }
      }
    }

    const win = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    function checkWinner() {
      for (let i = 0; i < win.length; i++) {
        const condition = win[i];
        const box1 = options[condition[0]];
        const box2 = options[condition[1]];
        const box3 = options[condition[2]];
        if (box1 == "" || box2 == "" || box3 == "") {
          continue;
        }
        if (box1 == box2 && box2 == box3) {
          gameOver = true;
          return true;
        }
      }
      if (!options.includes("")) {
        gameOver = true;
        return false;
      } else {
        if (currentPlayer === playerOne) {
          currentPlayer = playerTwo;
        } else {
          currentPlayer = playerOne;
        }
        return false;
      }
    }
  },
};
