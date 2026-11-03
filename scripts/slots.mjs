// Every spot on the pages that shows a photo, in the order your photos fill them.
// `ratio` is the spot's width / height: each photo is cropped to it around its most interesting part.
// `grade` is the film look it gets (see grades.mjs). The keys are what src/data/content.js refers to,
// and naming a file in photos/ after a key (cover.jpg, camera-03.png ...) puts that photo exactly there.
export const SLOTS = [
  // The two that matter most: the book's cover and the big photo on the last page
  { key: 'cover', ratio: 0.7914, grade: 'fine' },
  { key: 'finale', ratio: 0.711, grade: 'dreamy' },
  { key: 'cover-inside', ratio: 0.9076, grade: 'flash' },
  { key: 'finale-side', ratio: 0.7521, grade: 'golden' },

  // The retro camera: one print per shutter press
  { key: 'camera-01', ratio: 0.9076, grade: 'flash' },
  { key: 'camera-02', ratio: 0.9076, grade: 'flash' },
  { key: 'camera-03', ratio: 0.9, grade: 'flash' },
  { key: 'camera-04', ratio: 0.9375, grade: 'flash' },
  { key: 'camera-05', ratio: 0.8531, grade: 'flash' },
  { key: 'camera-06', ratio: 0.9, grade: 'disposable' },
  { key: 'camera-07', ratio: 1.0047, grade: 'disposable' },
  { key: 'camera-08', ratio: 0.8612, grade: 'disposable' },
  { key: 'camera-09', ratio: 0.8779, grade: 'fine' },
  { key: 'camera-10', ratio: 1.0045, grade: 'disposable' },
  { key: 'camera-11', ratio: 0.9365, grade: 'fine' },
  { key: 'camera-12', ratio: 0.9, grade: 'golden' },
  { key: 'camera-13', ratio: 0.9365, grade: 'fine' },
  { key: 'camera-14', ratio: 0.9063, grade: 'fine' },
  { key: 'camera-15', ratio: 0.9, grade: 'fine' },
  { key: 'camera-16', ratio: 0.9365, grade: 'fine' },
  { key: 'camera-17', ratio: 0.8291, grade: 'disposable' },
  { key: 'camera-18', ratio: 0.8438, grade: 'flash' },

  // The pink birthday diary
  { key: 'diary-hero', ratio: 0.8036, grade: 'blush' },
  { key: 'diary-strip-1', ratio: 0.6861, grade: 'film' },
  { key: 'diary-strip-2', ratio: 0.8359, grade: 'blush' },
  { key: 'diary-strip-3', ratio: 0.6857, grade: 'dreamy' },
  { key: 'diary-mono', ratio: 0.6696, grade: 'mono' },

  // The spinning ring
  { key: 'ring-01', ratio: 0.8, grade: 'blush' },
  { key: 'ring-02', ratio: 0.8, grade: 'dreamy' },
  { key: 'ring-03', ratio: 0.8, grade: 'blush' },
  { key: 'ring-04', ratio: 0.8, grade: 'golden' },
  { key: 'ring-05', ratio: 0.8, grade: 'film' },
  { key: 'ring-06', ratio: 0.8, grade: 'blush' },
  { key: 'ring-07', ratio: 0.8, grade: 'fade' },
  { key: 'ring-08', ratio: 0.8, grade: 'film' },
  { key: 'ring-09', ratio: 0.8, grade: 'golden' },
  { key: 'ring-10', ratio: 0.8, grade: 'film' },

  // The walk through the tunnel of photos
  { key: 'tunnel-01', ratio: 0.8518, grade: 'film' },
  { key: 'tunnel-02', ratio: 0.7348, grade: 'golden' },
  { key: 'tunnel-03', ratio: 0.7853, grade: 'film' },
  { key: 'tunnel-04', ratio: 0.7503, grade: 'fade' },
  { key: 'tunnel-05', ratio: 0.7285, grade: 'disposable' },
  { key: 'tunnel-06', ratio: 1.1104, grade: 'dreamy' },
  { key: 'tunnel-07', ratio: 0.809, grade: 'disposable' },
  { key: 'tunnel-08', ratio: 0.7906, grade: 'dreamy' },
  { key: 'tunnel-09', ratio: 0.7881, grade: 'golden' },
  { key: 'tunnel-10', ratio: 0.7712, grade: 'film' },
  { key: 'tunnel-11', ratio: 0.9673, grade: 'golden' },
  { key: 'tunnel-12', ratio: 0.5849, grade: 'disposable' },
  { key: 'tunnel-13', ratio: 0.8314, grade: 'leak' },
  { key: 'tunnel-14', ratio: 0.7883, grade: 'fade' },

  // The cherry-red page
  { key: 'cherry-1', ratio: 0.7334, grade: 'film' },
  { key: 'cherry-2', ratio: 0.8438, grade: 'dreamy' },
  { key: 'cherry-3', ratio: 0.7521, grade: 'film' },
  { key: 'cherry-4', ratio: 0.7521, grade: 'leak' },
  { key: 'cherry-5', ratio: 1.0286, grade: 'film' },
  { key: 'cherry-6', ratio: 0.875, grade: 'leak' },
  { key: 'cherry-7', ratio: 0.7847, grade: 'disposable' },

  // The cream journal (black and white) and its loose pages
  { key: 'journal-1', ratio: 0.9076, grade: 'mono' },
  { key: 'journal-2', ratio: 0.6432, grade: 'mono' },
  { key: 'journal-3', ratio: 0.9076, grade: 'mono' },
  { key: 'journal-4', ratio: 0.7005, grade: 'mono' },
  { key: 'journal-5', ratio: 0.8623, grade: 'mono' },
  { key: 'journal-6', ratio: 0.7815, grade: 'fade' },
  { key: 'journal-7', ratio: 0.9432, grade: 'mono' },
  { key: 'journal-8', ratio: 0.6429, grade: 'mono' },

  // The blue butterfly page
  { key: 'blue-1', ratio: 1.0225, grade: 'cool' },
  { key: 'blue-2', ratio: 0.6767, grade: 'cool' },
  { key: 'blue-3', ratio: 0.7666, grade: 'cool' },
  { key: 'blue-4', ratio: 0.7336, grade: 'cool' },
  { key: 'blue-5', ratio: 0.7688, grade: 'fade' },
  { key: 'blue-6', ratio: 0.8623, grade: 'cool' },
  { key: 'blue-7', ratio: 0.7835, grade: 'fade' },
  { key: 'blue-8', ratio: 0.93, grade: 'cool' },

  // The yellow sunshine page
  { key: 'sunshine-1', ratio: 1.0225, grade: 'golden' },
  { key: 'sunshine-2', ratio: 0.9643, grade: 'leak' },
  { key: 'sunshine-3', ratio: 1.0847, grade: 'golden' },
  { key: 'sunshine-4', ratio: 0.7348, grade: 'golden' },
  { key: 'sunshine-5', ratio: 1.0714, grade: 'golden' },
  { key: 'sunshine-6', ratio: 0.8214, grade: 'golden' },
]
