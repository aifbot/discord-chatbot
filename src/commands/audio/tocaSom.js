const {
	createAudioResource,
	VoiceConnectionStatus,
	joinVoiceChannel,
	entersState,
	createAudioPlayer,
} = require("@discordjs/voice");
const { join } = require("node:path");

const player = createAudioPlayer();
const resource = createAudioResource(
	join(__dirname, "../../assets/audios/Old-telephone-ring-sound-effect.mp3"),
	{ inlineVolume: true }
);
resource.volume.setVolume(1.5);

async function connectToChannel(interaction) {
	const connection = joinVoiceChannel({
		channelId: interaction.member.voice.channel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
	});
	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 2_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

module.exports = {
	name: "tele",
	description: "toca o som de um telefone antigo",
	type: 1,

	async run(client, interaction) {
		if (!interaction.member.voice.channel) {
			return interaction.reply(
				"Você precisa estar em um canal de voz para usar este comando!"
			);
		}

		try {
			const connection = await connectToChannel(interaction);
			connection.subscribe(player);
			interaction.reply("**tiririnrinrinrin tiririririn ☎️ **");
			player.play(resource);
		} catch (error) {
			console.error(error);
		}
	},
};
