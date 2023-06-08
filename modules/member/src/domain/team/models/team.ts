import { TeamCreated } from '@domain/team/events'
import { TeamId, TeamName } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { IEntity } from '@kobe/common/domain'

export class Team implements IEntity {
  private constructor(public readonly id: TeamId, private readonly name: TeamName, private members: TeamMembers) {}

  static create(args: { members: TeamMembers; latestTeam?: Team }) {
    const teamName = args.latestTeam ? args.latestTeam.name.next : TeamName.first

    const event = new TeamCreated(teamName, args.members)
    const team = this.prototype.onCreated(event)

    return [team, event] as const
  }

  onCreated(event: TeamCreated) {
    return new Team(event.teamId, event.name, event.members)
  }

  equals(other: Team): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct(args: { id: TeamId; name: TeamName; members: TeamMembers }) {
    return new Team(args.id, args.name, args.members)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
      members: this.members.serialize(),
    }
  }
}