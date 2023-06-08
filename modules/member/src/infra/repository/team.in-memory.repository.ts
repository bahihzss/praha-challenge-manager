/* istanbul ignore file */

import { TeamEvent } from '@domain/team/events'
import { TeamRepository } from '@domain/team/interfaces'
import { Team, TeamId } from '@domain/team/models'

export class TeamInMemoryRepository implements TeamRepository {
  constructor(public teams: Team[] = []) {}

  _register(team: Team) {
    this.teams.push(team)
  }

  async store(team: Team, teamEvent: TeamEvent) {
    this.teams.push(team)
  }

  async findById(teamId: TeamId) {
    return this.teams.find((team) => team.id.equals(teamId))
  }

  async findLatest() {
    return this.teams.slice(-1)[0]
  }
}