import { Participant, ParticipantId, ParticipantName } from '@domain/participant/models'
import { Faker } from '@domain/utils'
import { patterns } from '@kobe/patterns'

describe('Participant', () => {
  test('enroll で参加者を登録できる', () => {
    const [participant, participantEnrolledEvent] = Participant.enroll({
      name: new ParticipantName('Hikaru Inafune'),
    })

    expect(participant.serialize()).toEqual({
      id: expect.stringMatching(patterns.ulid),
      name: 'Hikaru Inafune',
    })

    expect(participantEnrolledEvent.serialize()).toEqual({
      type: 'ParticipantEnrolled',
      payload: {
        id: expect.stringMatching(patterns.ulid),
        participantId: expect.stringMatching(patterns.ulid),
        name: 'Hikaru Inafune',
        enrolledAt: expect.any(Date),
      },
    })
  })

  test('reconstruct は DB のデータからインスタンスを再構築する', () => {
    const participant = Participant.reconstruct({
      id: new ParticipantId('01F0YQZJQZ2XQZJQZJQZJQZJQZ'),
      name: new ParticipantName('Hikaru Inafune'),
    })

    expect(participant.serialize()).toEqual({
      id: '01F0YQZJQZ2XQZJQZJQZJQZJQZ',
      name: 'Hikaru Inafune',
    })
  })

  test('equals で等価性を判定できる', () => {
    const participant1 = Participant.reconstruct({
      id: new ParticipantId(Faker.ulid('A')),
      name: new ParticipantName('Hikaru Inafune'),
    })
    const participant2 = Participant.reconstruct({
      id: new ParticipantId(Faker.ulid('B')),
      name: new ParticipantName('Yamashita Norio'),
    })
    const otherParticipant1 = Participant.reconstruct({
      id: new ParticipantId(Faker.ulid('A')),
      name: new ParticipantName('Hikaru Inafune'),
    })

    expect(participant1.equals(participant2)).toBe(false)
    expect(participant1.equals(otherParticipant1)).toBe(true)
  })
})
