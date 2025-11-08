class ConstructionService {
  constructor() {
    // Simulated construction projects
    this.projects = {
      'RW001': {
        projectId: 'RW001',
        projectName: 'Riverwood Heights - Tower A',
        customerName: 'Rajesh Kumar',
        flatNumber: 'A-1204',
        startDate: '2024-01-15',
        expectedCompletion: '2025-06-30'
      },
      'RW002': {
        projectId: 'RW002',
        projectName: 'Riverwood Gardens - Villa 5',
        customerName: 'Priya Sharma',
        flatNumber: 'Villa-5',
        startDate: '2024-03-01',
        expectedCompletion: '2025-08-15'
      }
    };

    // Construction phases
    this.phases = [
      'Foundation Work',
      'Ground Floor Construction',
      'First Floor Construction',
      'Second Floor Construction',
      'Roof Construction',
      'Plumbing & Electrical',
      'Plastering & Finishing',
      'Flooring Work',
      'Painting',
      'Final Touches'
    ];

    // Update templates
    this.updateTemplates = [
      {
        phase: 'Foundation Work',
        updates: [
          'Foundation excavation completed successfully',
          'Concrete pouring for foundation started',
          'Foundation work 80% complete',
          'Quality check passed for foundation'
        ]
      },
      {
        phase: 'Ground Floor Construction',
        updates: [
          'Ground floor pillars erected',
          'Ground floor slab work in progress',
          'Ground floor structure 60% complete',
          'Ground floor walls construction started'
        ]
      },
      {
        phase: 'Plumbing & Electrical',
        updates: [
          'Electrical wiring installation started',
          'Plumbing pipes installation in progress',
          'Electrical panel boxes installed',
          'Water supply lines connected'
        ]
      },
      {
        phase: 'Plastering & Finishing',
        updates: [
          'Internal plastering work started',
          'External plastering 50% complete',
          'Ceiling work in progress',
          'Wall finishing touches being done'
        ]
      },
      {
        phase: 'Flooring Work',
        updates: [
          'Flooring material delivered to site',
          'Living room flooring completed',
          'Bedroom flooring in progress',
          'Kitchen tiles installation started'
        ]
      }
    ];
  }

  getProjectInfo(projectId) {
    return this.projects[projectId] || null;
  }

  generateDailyUpdate(projectId) {
    const project = this.projects[projectId];
    if (!project) {
      return null;
    }

    // Randomly select a phase and update
    const randomPhase = this.updateTemplates[
      Math.floor(Math.random() * this.updateTemplates.length)
    ];
    
    const randomUpdate = randomPhase.updates[
      Math.floor(Math.random() * randomPhase.updates.length)
    ];

    // Generate random progress percentage
    const progress = Math.floor(Math.random() * 30) + 60; // 60-90%

    // Random completion date adjustment
    const daysAhead = Math.floor(Math.random() * 10) - 5; // -5 to +5 days

    const update = {
      projectId: project.projectId,
      projectName: project.projectName,
      customerName: project.customerName,
      flatNumber: project.flatNumber,
      date: new Date().toISOString().split('T')[0],
      currentPhase: randomPhase.phase,
      updateMessage: randomUpdate,
      overallProgress: progress,
      completionStatus: daysAhead >= 0 ? 'On Schedule' : 'Slightly Ahead',
      nextMilestone: this.getNextMilestone(randomPhase.phase),
      images: this.generateImagePlaceholders(),
      weather: this.getWeatherStatus(),
      workersOnSite: Math.floor(Math.random() * 20) + 15
    };

    return update;
  }

  getNextMilestone(currentPhase) {
    const milestones = {
      'Foundation Work': 'Ground floor construction to begin next week',
      'Ground Floor Construction': 'First floor work starting in 10 days',
      'Plumbing & Electrical': 'Plastering work to commence soon',
      'Plastering & Finishing': 'Flooring work scheduled for next month',
      'Flooring Work': 'Painting work to start in 2 weeks'
    };

    return milestones[currentPhase] || 'Next phase update coming soon';
  }

  generateImagePlaceholders() {
    return [
      'https://placeholder.com/construction-1.jpg',
      'https://placeholder.com/construction-2.jpg'
    ];
  }

  getWeatherStatus() {
    const conditions = ['Clear', 'Partly Cloudy', 'Sunny', 'Overcast'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  getAllProjects() {
    return Object.values(this.projects);
  }

  getConstructionTimeline(projectId) {
    const project = this.projects[projectId];
    if (!project) return null;

    return {
      projectId: project.projectId,
      phases: this.phases.map((phase, index) => ({
        name: phase,
        status: index < 5 ? 'completed' : index === 5 ? 'in-progress' : 'pending',
        startDate: this.calculatePhaseDate(project.startDate, index * 30),
        endDate: this.calculatePhaseDate(project.startDate, (index + 1) * 30)
      }))
    };
  }

  calculatePhaseDate(startDate, daysToAdd) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  }
}

export default new ConstructionService();
