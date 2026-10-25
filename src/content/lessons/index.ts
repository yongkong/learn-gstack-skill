import type { Lesson } from '../types';
import { lesson0001 } from './0001-laziness-protocol';
import { lesson0002 } from './0002-prove-before-deleting';
import { lesson0003 } from './0003-shape-first';
import { lesson0004 } from './0004-attack-the-premise';
import { lesson0005 } from './0005-compare-then-build-the-lever';
import { lesson0006 } from './0006-make-illegal-states-unrepresentable';
import { lesson0007 } from './0007-guards-at-the-boundary';
import { lesson0008 } from './0008-safe-to-rerun';
import { lesson0009 } from './0009-as-if-it-was-always-there';
import { lesson0010 } from './0010-prove-it-works';
import { lesson0011 } from './0011-verifiable-units';
import { lesson0012 } from './0012-explain-the-number';
import { lesson0013 } from './0013-main-thread-keeps-conclusions';
import { lesson0014 } from './0014-pick-the-playbook';
import { lesson0015 } from './0015-straight-to-target-architecture';
import { lesson0016 } from './0016-let-the-rule-enforce-itself';

export const LESSONS: Lesson[] = [
  lesson0001,
  lesson0002,
  lesson0003,
  lesson0004,
  lesson0005,
  lesson0006,
  lesson0007,
  lesson0008,
  lesson0009,
  lesson0010,
  lesson0011,
  lesson0012,
  lesson0013,
  lesson0014,
  lesson0015,
  lesson0016,
];

export const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));
