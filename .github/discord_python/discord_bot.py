import os
import discord
import argparse

# Construct an argument parser
all_args = argparse.ArgumentParser()

# Add arguments to the parser
all_args.add_argument("-s", "--Success", required=True, help="success Value")
all_args.add_argument("-b", "--Branch", required=True, help="branch Value")
all_args.add_argument("-t", "--Time", required=True, help="time Value")
all_args.add_argument("-a", "--Actor", required=True, help="Actor Name")
all_args.add_argument("-p", "--Pipeline", required=True, help="pipeline Value")
all_args.add_argument("-r", "--Runner", required=True, help="Runner Name")
all_args.add_argument("-c", "--Commit", required=True, help="Commit Hash")
args = vars(all_args.parse_args())

client = discord.Client()


@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    channel = client.get_channel(int(os.environ['DISCORD_CHANNEL_TOKEN']))

    embed = discord.Embed(
        title=(('Unsuccessfully', 'Successfully')[args['Success'] == 'success']) + ' deployed 13TRIS',
        color=(0xb20000, 0x04b30d)[args['Success'] == 'success'])
    embed.set_author(
        name='GitHub - {0.user}'.format(client),
        url='https://github.com/13TRIS/13TRIS/actions/runs/' + args['Pipeline'],
        icon_url='https://pics.freeicons.io/uploads/icons/png/' +
                 (('16618812301557740370-32.png', '6549974331557740369-32.png')[args['Success'] == 'success']))
    embed.add_field(
        name='Branch',
        value='[{0}](https://github.com/13TRIS/13TRIS/tree/{0})'.format(args["Branch"]),
        inline=True)
    embed.add_field(
        name='Actor',
        value=args['Actor'],
        inline=True)
    embed.add_field(
        name='Pipeline',
        value='[{0}](https://github.com/13TRIS/13TRIS/actions/runs/{0})'.format(args["Pipeline"]),
        inline=True)
    embed.add_field(
        name='Commit',
        value='[{0:7.7}](https://github.com/13TRIS/13TRIS/commit/{0})'.format(args['Commit']),
        inline=True)
    embed.add_field(
        name='Runner',
        value=args['Runner'],
        inline=True)
    embed.add_field(
        name='Time',
        value=args['Time'],
        inline=True)
    embed.set_footer(text='[https://mkrabs.duckdns.org](https://mkrabs.duckdns.org)')
    await channel.send(embed=embed)
    await client.close()


client.run(os.environ['DISCORD_BOT_TOKEN'])
