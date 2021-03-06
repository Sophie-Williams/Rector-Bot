const Commands = require('./role-commands.js');

var commands = 
{
    verify: {
        permissions:['288244917367734273'],
        command:Commands.Verify
    },
    verified: {
        permissions:['287963427362832386'],
        command:Commands.Verified
    },
    ignore: {
        permissions:['288244917367734273'],
        command:Commands.Ignore
    },
    removeignore: {
        permissions:['288244917367734273'],
        command:Commands.RemoveIgnore
    },
    rolehelp: {
        permissions:['288244917367734273'],
        command:Commands.RoleHelp
    }
}

async function ProcessComand(message)
{
    let messageSplit =  message.content.split(" ");
    let commandName = messageSplit[0].substring(1).toLowerCase();
    
    if( !(commandName in commands) )
    {
        //Normally it should let the user know there is a help command for all the role commands.
        //However since there are other commands distributed through ./basic-commands we don't know if the user has called a command.
        //In the future the basic commands should be moved here or to a central command module for checking.

        //await message.channel.send("Unknown command. Check **!rolehelp** for list of available commands.");
        return;
    }
    else
    {
        let command = commands[commandName];
        if(!MemberHasPermission(message.member, command))
        {
            await message.channel.send("You don't have permission to use this command.");
            return;
        }
        else
        {
            command.command(message);
        }
    }
}

function MemberHasPermission(member, command)
{
    let userRoles = [];
    member.roles.forEach(role => {
        userRoles.push(role.id);
    });

    for (let i = 0; i < command.permissions.length; i++) {
        const element = command.permissions[i];
        if(userRoles.includes(element))
        {
            return true;
        }
    }
    return false;
}

exports.ProcessComand = ProcessComand;