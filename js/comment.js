const gitalk = new Gitalk({
  clientID: '8f8b00c0f9a02da92827',
  clientSecret: 'e9e5f5370d1497b34960a41d0027faf1ee508cf1', // new:a0cbb95598b1c9132a2f82b2389ce1b93bdd20b1
  repo: 'anchem.github.io',
  owner: 'anchem',
  admin: ['anchem'],
  id: location.pathname, // Ensure uniqueness and length less than 50
  title: 'thoughts_repo',
  distractionFreeMode: false, // Facebook-like distraction free mode
  createIssueManually: true,
  labels: ['comment','Gitalk'],
  language: 'zh-CN',
  pagerDirection: 'last',
  isLocked: true
});

gitalk.render('gitalk-container');
