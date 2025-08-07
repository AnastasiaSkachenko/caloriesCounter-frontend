import { ActivityType } from "../components/interfaces";

export  const descriptions: Record<ActivityType, Record<number, string>> = {
    "workout": {
      1: 'Light weights with long rest times (1-2 minutes between sets), suitable for beginners or active recovery.',
      2: 'Light weights with short rest times (30 sec), moderate effort that targets endurance.',
      3: 'Moderate weights, moderate rest times (45-60 sec), targeting muscle endurance and hypertrophy.',
      4: 'Heavy weights, short rest times (30-45 sec), challenging strength training focused on building muscle.',
      5: 'Maximum effort, heavy weights with minimal rest (15-30 sec), for intense strength and muscle growth.'
    },
    "tabata": {
      1: 'Low intensity Tabata, 20 seconds of work with 40 seconds of rest, focusing on form and light effort.',
      2: 'Moderate intensity Tabata, 20 seconds of work with 30 seconds of rest, moderate effort to increase endurance.',
      3: 'Standard Tabata, 20 seconds of high effort with 10 seconds of rest, intense and fast-paced intervals.',
      4: 'High intensity Tabata, 20 seconds of maximum effort with 10 seconds rest, for building cardiovascular fitness and stamina.',
      5: 'All-out effort, 20 seconds of very high-intensity work with minimal rest, pushing your limits in every set.'
    },
    "run": {
      1: 'Easy-paced run, comfortable for a beginner with a focus on steady endurance, around 7:00 min/km (10+ km/h).',
      2: 'Moderate-paced run, brisk pace but still conversational, around 6:00 min/km (10-12 km/h).',
      3: 'Moderate pace with intervals of faster running, around 5:30 min/km (11-12 km/h) with brief bursts of speed.',
      4: 'Fast-paced run, challenging but sustainable pace for an intermediate runner, around 4:30 min/km (13-14 km/h).',
      5: 'All-out sprinting, fast pace that is difficult to maintain, sprint intervals at 4:00 min/km or faster (15+ km/h).'
    },
    "walk_time": {
      1: 'Very slow walk, easy pace with minimal effort, suitable for warm-ups or active recovery.',
      2: 'Moderate walk, at a brisk pace, around 3 mph (5 km/h), good for general health and endurance.',
      3: 'Power walking, faster pace with some intensity, around 4-4.5 mph (6.5-7.5 km/h), enough to raise heart rate.',
      4: 'Fast-paced walk, with noticeable elevation gain or speed, around 5 mph (8 km/h).',
      5: 'Hill walking or fast-paced walk, with steep incline and sustained effort, challenging cardio workout.'
    },
    "walk_steps": {
      1: 'Very slow pace with minimal elevation, comfortable walking with little challenge.',
      2: 'Moderate pace with small elevation or incline, focusing on maintaining a steady pace.',
      3: 'Moderate to fast pace with moderate steps or slight inclines, working on endurance and power.',
      4: 'Brisk pace with frequent inclines or moderate elevation, challenging both speed and strength.',
      5: 'Fast-paced with heavy elevation or steep inclines, pushing cardio and muscular endurance to the max.'
    },
    "interval_run": {
      1: '1-minute jog, 2-minute rest. Easy-paced intervals with long rest.',
      2: '1-minute run, 1-minute rest. Moderate effort with equal work/rest time.',
      3: '1-minute run, 1-minute rest, targeting a moderate pace with moderate intensity.',
      4: '1-minute sprint, 1-minute rest. High intensity sprints with short recovery for intense stamina and speed.',
      5: '1-minute all-out sprint, 1-minute rest. Maximum effort, pushing speed and power.'
    },
    "custom": {
      1: 'Light activity, easy effort with no specific intensity target.',
      2: 'Moderate activity, maintaining steady and manageable effort.',
      3: 'Challenging activity, maintaining a high effort with some fatigue.',
      4: 'High intensity activity, pushing your limits for strength and endurance.',
      5: 'Maximum intensity, all-out effort for peak performance.'
    },
    "volleyball": {
      1: 'Light training or warm-up, focusing on skill practice with minimal intensity.',
      2: 'Moderate practice, drills that work on technique but still focus on endurance.',
      3: 'Standard game pace or light match play, moderate physical effort with continuous movement.',
      4: 'Competitive game pace, fast play with intense movements, including jumping and quick reflexes.',
      5: 'Full game intensity, with maximum effort in every move, playing at peak capacity.'
    },
    "jumping": {
      1: 'Slow and controlled jumps, focusing on form and light effort.',
      2: 'Moderate jumping, such as low-intensity plyometrics with short rest periods.',
      3: 'Standard jumping with moderate plyometrics or jump rope, moderate intensity and effort.',
      4: 'High intensity jumping or jump rope, focused on speed and explosive effort.',
      5: 'Maximal jumping intensity, including intense intervals, heavy jump rope, or explosive box jumps.'
    },
    "stretching": {
      1: 'Very light stretching or basic mobility exercises, gentle and relaxing.',
      2: 'Moderate stretching or yoga, focusing on increasing flexibility but at a manageable level.',
      3: 'Dynamic stretching, incorporating active stretches and mobility exercises, moderate intensity.',
      4: 'Intense yoga or flexibility work, focusing on deeper stretches with significant effort.',
      5: 'Maximum intensity flexibility or mobility, pushing limits with advanced stretching techniques or deep yoga poses.'
    },
    "home_chores": {
    1: "Very light chores such as dusting or light tidying, minimal movement.",
    2: "Light chores like folding laundry, washing dishes, or casual cleaning.",
    3: "Moderate chores like sweeping, vacuuming, or organizing rooms.",
    4: "Intense chores such as mopping, carrying boxes, or scrubbing floors.",
    5: "Very intense or sustained chores like deep cleaning multiple rooms or moving furniture."
  }
};
  