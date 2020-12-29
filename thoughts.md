---
layout: page
title: 随想 Thoughts
description: 每日所思
background: '/img/bg-about.jpg'
---

<ul>
{% for thoughts in site.data.thoughts %}
  <li>
      【{{ thoughts.date }}】 - thoughts.content
  </li>
{% endfor %}
</ul>
