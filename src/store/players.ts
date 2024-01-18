import { BikeTagClient } from 'biketag'
import { getPlayersPayload } from 'biketag/lib/common/payloads'
import { Game } from 'biketag/lib/common/schema'
import request from 'request'
import { getBikeTagAdminOpts, getPayloadOpts } from '../common/methods'

const playersHandler = async (event: any) => {
  const biketagOpts = getBikeTagAdminOpts(
    {
      ...event,
      method: event.httpMethod,
    } as unknown as request.Request,
    true,
  )
  const biketag = new BikeTagClient(biketagOpts)
  const game = (await biketag.game(biketagOpts.game, {
    source: 'sanity',
    concise: true,
  })) as unknown as Game
  const biketagPayload = getPayloadOpts(event, {
    imgur: {
      hash: game.mainhash,
    },
    game: biketagOpts.game,
  })
  const playersResponse = await biketag.getPlayers(biketagPayload as getPlayersPayload, {
    source: 'imgur',
  })
  const { success, data } = playersResponse

  return {
    statusCode: playersResponse.status,
    body: JSON.stringify(success ? data : playersResponse),
  }
}

export { playersHandler as handler }
