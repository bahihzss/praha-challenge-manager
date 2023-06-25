import { ChallengeDescription } from '@domain/challenge/challenge-description'
import { ChallengeId } from '@domain/challenge/challenge-id'
import { ChallengeTitle } from '@domain/challenge/challenge-title'
import { IEntity } from '@kobe/common/domain'

export class Challenge implements IEntity {
  constructor(
    private readonly id: ChallengeId,
    private readonly title: ChallengeTitle,
    private readonly description: ChallengeDescription,
  ) {}

  static create(param: { description: ChallengeDescription; title: ChallengeTitle }) {
    return new Challenge(new ChallengeId(), param.title, param.description)
  }

  static reconstruct(param: { description: ChallengeDescription; id: ChallengeId; title: ChallengeTitle }) {
    return new Challenge(param.id, param.title, param.description)
  }

  serialize() {
    return {
      id: this.id.value,
      title: this.title.value,
      description: this.description.value,
    }
  }
}
