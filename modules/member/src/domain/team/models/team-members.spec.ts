import { ParticipantId } from '@domain/participant/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { Faker } from '@domain/utils'
import { DomainException } from '@kobe/common/domain/error'

describe('TeamMembers', () => {
  test('参加者 ID を配列で渡すと作成できる', () => {
    const memberIds = Faker.participantIdArray(3)

    const actualTeamMembers = new TeamMembers(memberIds)

    const serialized = actualTeamMembers.serialize()
    expect(serialized.length).toBe(3)
    expect(serialized).toEqual(expect.arrayContaining([memberIds[0].value, memberIds[1].value, memberIds[2].value]))
  })

  test('３人未満のチームは作成できない', () => {
    const memberIds = Faker.participantIdArray(2)

    const act = () => new TeamMembers(memberIds)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`メンバー数は最低 3 人必要です`)
  })

  test('重複して参加することはできない', () => {
    const participantId = new ParticipantId()

    const act = () => new TeamMembers([participantId, participantId, new ParticipantId()])

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`重複した参加者がいます`)
  })

  test('メンバーを追加できる', () => {
    const memberIds = Faker.participantIdArray(3)
    const teamMembers = new TeamMembers(memberIds)
    const newMemberIds = new ParticipantId()

    const actualTeamMembers = teamMembers.add(newMemberIds)

    const serialized = actualTeamMembers.serialize()
    expect(serialized.length).toBe(4)
    expect(serialized).toEqual(expect.arrayContaining([newMemberIds.value]))
  })

  test('メンバーを削除できる', () => {
    const memberIds = Faker.participantIdArray(4)
    const teamMembers = new TeamMembers(memberIds)
    const leavingMemberId = memberIds[0]

    const actualTeamMembers = teamMembers.remove(leavingMemberId)

    const serialized = actualTeamMembers.serialize()
    expect(serialized.length).toBe(3)
    expect(serialized).not.toEqual(expect.arrayContaining([leavingMemberId.value]))
  })

  test('存在しないメンバーは削除できない', () => {
    const memberIds = Faker.participantIdArray(3)
    const teamMembers = new TeamMembers(memberIds)
    const nonMemberId = new ParticipantId()

    const act = () => teamMembers.remove(nonMemberId)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`${nonMemberId.value} は在籍していません`)
  })
})