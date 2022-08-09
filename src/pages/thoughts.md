<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css" />
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>

<div id="gitalk-container"></div>

<script>
const gitalk = new Gitalk({
  clientID: '8f8b00c0f9a02da92827',
  clientSecret: 'a0cbb95598b1c9132a2f82b2389ce1b93bdd20b1',
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
</script>
