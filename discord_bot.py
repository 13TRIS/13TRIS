import os
import discord
import asyncio
import argparse

# Construct an argument parser
all_args = argparse.ArgumentParser()

# Add arguments to the parser
all_args.add_argument("-s", "--Success", required=True, help="success Value")
all_args.add_argument("-b", "--Branch", required=True, help="branch Value")
all_args.add_argument("-t", "--Time", required=True, help="time Value")
all_args.add_argument("-p", "--Pipeline", required=True, help="pipeline Value")
args = vars(all_args.parse_args())

client = discord.Client()


@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    channel = client.get_channel(799575937984495630)

    embed = discord.Embed(title="Successfully deployed 13TRIS", color=0x04b30d)
    embed.set_author(name="GitHub Pipeline", url="https://mkrabs.duckdns.org",
                     icon_url="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.iconsdb.com%2Ficons"
                              "%2Fdownload%2Fgreen%2Fcheckmark-128.png&f=1&nofb=1")
    embed.add_field(name="Branch", value=args['Branch'], inline=True)
    embed.add_field(name="Time", value=args['Time'], inline=True)
    embed.add_field(name="Pipeline", value=args['Pipeline'], inline=True)
    embed.set_footer(text="https://mkrabs.duckdns.org")
    await channel.send(embed=embed)
    await client.close()


client.run(os.environ['DISCORD_BOT_TOKEN'])
