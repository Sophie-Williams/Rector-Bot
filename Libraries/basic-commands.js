const Discord = require("discord.js");

function getRole(roleInput, channel) {
    if(roleInput == null)
        return null;
    //Sırasıyla mention, ID ve roleİsmi kombinasyonlarını deneyeceğiz. -Mert
    return channel.guild.roles.find(role => role.toString() === roleInput)
        || channel.guild.roles.find(role => role.id === roleInput) 
        || channel.guild.roles.find(role => role.name.toLowerCase() === roleInput.toLowerCase());
    
}

async function RunCommand(msg, channel)
{
    let input = msg.content.slice(PREFIX.length).split(" ");
    let commandName = input.shift().toLowerCase();
    
    if (commandName === "roleset") {
        msg.delete(REPLY_DURATION);
        if (msg.member.permissions.has('MANAGE_ROLES')) {
            if (input.length === 0) {
                //C#'da yazsam burayı methodun içerisine koymakla kalmaz bu tür methodları yazdığım bir sınıf oluştururdum.
                //Java'da nasıl oluyor çözemedim -Sercan.

                let roleList = await AllowedRoles.findAll({ attributes: ['name'] });

                if (roleList.length < 1) {
                    channel.send('No role set.').then(msg => msg.delete(REPLY_DURATION));
                    return;
                }

                let result = 'Allowed roles are: ';
                result += roleList.map(t => t.name = `@${t.name}`).join(', ') + ".";

                channel.send(result).then(msg => msg.delete(REPLY_DURATION));
            }
            else if (input[0] === "add") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null) {
                    channel.send("You didn't choose any Role.").then(
                        msg => msg.delete(REPLY_DURATION)
                    )
                    return;
                }

                // INSERT INTO ...
                AllowedRoles.create({ roleId: selectedRole.id, name: selectedRole.name })
                    .then(() => { channel.send("The role is now allowed.").then(msg => msg.delete(REPLY_DURATION)) })
                    .catch((e) => {
                        if (e.name === "SequelizeUniqueConstraintError")
                            channel.send("That role already exists.").then(msg => msg.delete(REPLY_DURATION));
                        else {
                            console.error(e);
                            channel.send(e);
                        }
                    });
            }
            else if (input[0] === "remove") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null) {
                    channel.send("You didn't choose any Role.").then(
                        msg => msg.delete(REPLY_DURATION)
                    )
                    return;
                }

                // DELETE FROM . . .
                let rowCount = await AllowedRoles.destroy({ where: { roleId: selectedRole.id } })
                console.log(rowCount);
                if (rowCount) channel.send("Role removed.").then(msg => msg.delete(REPLY_DURATION));
                else channel.send("That role did not exist.").then(msg => msg.delete(REPLY_DURATION));
            }
            else channel.send("Invalid command.").then(msg => msg.delete(REPLY_DURATION));

        }
        else channel.send("You don't have permission to manage roles.").then(msg => msg.delete(REPLY_DURATION));
    }

    else if (commandName === "role") {

        msg.delete(REPLY_DURATION);
        // SELECT name FROM tags ...
        let roleList = await AllowedRoles.findAll({ attributes: ['roleId', 'name'] });

        if (input.length == 0) {
            //C#'da yazsam burayı methodun içerisine koymakla kalmaz bu tür methodları yazdığım bir sınıf oluştururdum.
            //Java'da nasıl oluyor çözemedim -Sercan.

            if (roleList.length < 1) {
                channel.send('No role set.').then(msg => msg.delete(REPLY_DURATION));
                return;
            }

            let result = 'Allowed roles are: ';
            result += roleList.map(t => t.name = `@${t.name}`).join(', ') + ".";

            channel.send(result).then(msg => msg.delete(REPLY_DURATION));
        } else

            if (input[0] === "add") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null)
                    channel.send("You didn't choose any Role.").then(
                        msg => msg.delete(REPLY_DURATION)
                    )
                else if (msg.member.roles.exists("id", selectedRole.id))
                    channel.send("You already have this role.").then(
                        msg => msg.delete(REPLY_DURATION)
                    )
                else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                    msg.member.addRole(selectedRole).then(
                        channel.send("You just took the role! :kissing_heart:").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                    );
                }
                else channel.send("You can't take this role :thumbsdown:").then(msg => msg.delete(REPLY_DURATION));

            } else if (input[0] === "remove") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null)
                    channel.send("Are you trying to remove nothing? :frowning:");
                else if (!msg.member.roles.exists("id", selectedRole.id))
                    channel.send("Do not worry, you already don't have this role.").then(
                        msg => msg.delete(REPLY_DURATION)
                    )
                else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                    msg.member.removeRole(selectedRole).then(
                        channel.send("You've removed your role! :kissing_heart:").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                    );
                }
                else
                    channel.send("You can't remove this role :thumbsdown:").then(
                        msg => msg.delete(REPLY_DURATION)
                    );
            }
            else channel.send("Invalid command.").then(msg => msg.delete(REPLY_DURATION));

    }

    else if (commandName === "help") {
        channel.send("Check out your PM.").then(msg => msg.delete(REPLY_DURATION));
        helpCommands(msg.member.user);
        msg.delete(REPLY_DURATION);
    }

    else if (commandName === "ping") {
        channel.send('pong! :ping_pong:');
    }

    else if (commandName === "pig") {
        channel.send(':pig:');
    }

    else if (commandName === "roleid") {
        channel.send(msg.mentions.roles.first().id);
    }

    else if (commandName === "kick") {

        if (msg.member.roles.exists("id", '288244917367734273')) {
            let userToKick = msg.mentions.members.first();
            if (userToKick == null) {
                channel.send('Command usage: !kick [member]');
            } else {
                userToKick.kick().catch(console.error);
            }
        } else {
            channel.send('You don\'t have permission to do that.')
            console.log(msg.member.roles)
        }
    }

    else if (commandName === "github") {
        channel.send("Check it out: https://github.com/smuhlaci/Rector-Bot");
    }
}

let WelcomeMessageChannelID = '331714238148116480';
function OnGuildMemberAdd(member)
{
    const channel = member.guild.channels.get(WelcomeMessageChannelID);
    channel.send(`Aramıza hoşgeldin ${member.user}. Onay almak için <#321012534477979648> kanalına göz at.`);
    member.createDM().then((pm) => {
        pm.send("Sunucuya !help yazarak kullanabileceğin komutlara erişim sağlayabilirsin.\n" +
                "#merhaba kanalına kendini veya projeni tanıtan bir paragraf yazabilirsin."+ 
                "Tabii hepsinden önce facebook grubumuzda olduğunu onaylatman gerekiyor. Grup yöneticisine facebook hesabınla Discord ismini mesaj atman yeterli!")
    })
}

function helpCommands(user) {
    user.createDM().then((pm) => {
        pm.send("-\n"+
            "**General Commands**\n\n" +
            "  **!ping** -- Pong!\n" +
            "  **!pig** -- pig?\n" +
            "  **!help** -- Guess what?\n" +
            "  **!role** -- Shows allowed roles.\n" +
            "     !role add [@Role] -- Take an allowed role yourself.\n" +
            "     !role remove [@Role] -- Remove an allowed role that you have.\n\n" +
            "**Developer Commands**\n\n" +
            "  **!roleid [@Role]** -- Shows the role's ID\n" +
            "  **!github** -- Sends GitHub repository link");
    });
}

function OnGuildMemberRemove(member)
{
    const channel = member.guild.channels.get(WelcomeMessageChannelID);
    channel.send(`${member.user} çıktı.`);
}

exports.RunCommand = RunCommand;
exports.OnGuildMemberAdd = OnGuildMemberAdd;