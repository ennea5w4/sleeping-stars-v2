(function(){
  const characters={
    1:{family:{ja:'Elias（エリアス）& Brio（ブリオ）',en:'Elias & Brio',ko:'Elias & Brio'},parent:'01_Elias.png',kid:'01_Brio.png'},
    2:{family:{ja:'Mila（ミラ）& Lune（ルーン）',en:'Mila & Lune',ko:'Mila & Lune'},parent:'02_Mila.png',kid:'02_Lune.png'},
    3:{family:{ja:'Luca（ルカ）& Noa（ノア）',en:'Luca & Noa',ko:'Luca & Noa'},parent:'03_Luca.png',kid:'03_Noa.png'},
    4:{family:{ja:'Alma（アルマ）& Iris（アイリス）',en:'Alma & Iris',ko:'Alma & Iris'},parent:'04_Alma.png',kid:'04_Iris.png'},
    5:{family:{ja:'Theo（テオ）& Sora（ソラ）',en:'Theo & Sora',ko:'Theo & Sora'},parent:'05_Theo.png',kid:'05_Sora.png'},
    6:{family:{ja:'Rowan（ローワン）& Atlas（アトラス）',en:'Rowan & Atlas',ko:'Rowan & Atlas'},parent:'06_Rowan.png',kid:'06_Atlas.png'},
    7:{family:{ja:'Finn（フィン）& Pico（ピコ）',en:'Finn & Pico',ko:'Finn & Pico'},parent:'07_Finn.png',kid:'07_Pico.png'},
    8:{family:{ja:'Dante（ダンテ）& Leo（レオ）',en:'Dante & Leo',ko:'Dante & Leo'},parent:'08_Dante.png',kid:'08_Leo.png'},
    9:{family:{ja:'Eden（エデン）& Moku（モク）',en:'Eden & Moku',ko:'Eden & Moku'},parent:'09_Eden.png',kid:'09_Moku.png'}
  };

  const ambient=[[18,28],[287,44],[304,221],[35,247],[250,275],[81,67]];
  const constellations={
    1:{stars:[[63,192,'c'],[101,164,'b'],[127,115,'a'],[137,63,'b'],[154,18,'a'],[176,91,'c'],[196,142,'b'],[88,87,'d'],[216,203,'c']],paths:[[[63,192],[101,164],[127,115],[137,63],[154,18]],[[127,115],[176,91]]]},
    2:{stars:[[45,72,'c'],[84,108,'b'],[74,174,'c'],[129,142,'a'],[153,165,'b'],[176,112,'b'],[219,74,'c'],[211,184,'c'],[111,87,'d'],[171,204,'d']],paths:[[[45,72],[84,108],[129,142],[153,165]],[[219,74],[176,112],[129,142]]]},
    3:{stars:[[30,210,'c'],[72,184,'b'],[96,135,'c'],[141,113,'a'],[166,72,'b'],[204,91,'c'],[230,23,'a'],[119,178,'d'],[188,42,'c']],paths:[[[30,210],[72,184],[96,135],[141,113],[166,72],[230,23]]]},
    4:{stars:[[58,169,'a'],[78,105,'b'],[111,195,'c'],[136,43,'a'],[158,126,'d'],[202,88,'b'],[226,172,'c'],[170,221,'b'],[38,63,'d']],paths:[[[58,169],[78,105],[136,43],[202,88]],[[111,195],[170,221],[226,172]]]},
    5:{stars:[[63,93,'b'],[82,70,'c'],[111,102,'a'],[135,78,'c'],[148,119,'b'],[91,139,'c'],[128,158,'b'],[157,173,'d'],[217,61,'c'],[240,39,'a']],paths:[[[63,93],[111,102],[148,119],[128,158],[91,139]]],fade:[[148,119],[176,98],[211,72]]},
    6:{stars:[[48,83,'b'],[105,51,'a'],[158,80,'c'],[211,68,'b'],[78,145,'c'],[132,130,'a'],[188,153,'b'],[112,207,'c'],[167,217,'b'],[224,194,'d']],paths:[[[48,83],[105,51],[158,80]],[[78,145],[132,130],[188,153]],[[112,207],[167,217]]]},
    7:{stars:[[36,196,'c'],[75,159,'b'],[108,113,'a'],[92,61,'c'],[137,35,'b'],[156,99,'c'],[198,72,'a'],[219,130,'b'],[175,181,'c'],[233,211,'d']],paths:[[[36,196],[75,159],[108,113],[92,61]],[[108,113],[137,35]],[[156,99],[198,72],[219,130]]]},
    8:{stars:[[53,182,'b'],[79,126,'c'],[118,157,'a'],[143,95,'b'],[165,34,'a'],[191,116,'c'],[218,183,'a'],[231,75,'b'],[41,73,'c'],[199,221,'d']],paths:[[[53,182],[118,157],[143,95],[165,34]],[[118,157],[218,183]],[[191,116],[231,75]]]},
    9:{stars:[[25,139,'c'],[66,128,'b'],[98,145,'c'],[130,126,'a'],[155,149,'d'],[187,136,'b'],[235,127,'c'],[79,183,'c'],[142,191,'b'],[211,177,'c'],[43,87,'d']],paths:[[[25,139],[66,128],[130,126],[187,136],[235,127]],[[79,183],[142,191],[211,177]]]}
  };

  const common={
    rotations:[0,4,8,3,7,2,6,1],
    characters,ambient,constellations,
    paidUrl:'https://rainy-muse.sunnyday.jp/#contact-personal',
    articleUrls:{ja:'https://note.com/rainy_muse',en:'https://medium.com/@rainy_muse',ko:'https://note.com/rainy_muse'}
  };

  const ja={
    meta:{lang:'ja',title:'Sleeping Stars v2｜心にひびく言葉から見つける、あなたの星座',description:'心に残る言葉を星として集める、3〜5分の静かな自己理解体験。8つの星空をめぐり、今のあなたの星座を見つけます。'},
    ui:{subhead:'A Journey into Your Stars',lead:'あなたの中に眠る星を、見つけにいこう。',detail:'9タイプの親子が暮らす館の夜。心に残る言葉を集めるうちに、あなたが惹かれやすいものや、大切にしている価値観の傾向が、ひとつの星座として浮かび上がります。',introAlt:'星とランタンに囲まれ、旅の入口を案内するLuneとPico',meta:['3〜5分','登録不要','結果は無料'],start:'星を見つけにいく',notice:'これはタイプを断定する診断ではありません。\n今のあなたに表れている傾向を、静かに眺めるための体験です。',choiceGuide:'ひとつだけ強く光る夜も、いくつかの星が残る夜もあります。今の心に近いものを、1〜3個選んでください。',found:'見つけた星',back:'戻る',next:'次の星空へ',see:'私の星座を見る',resultBrand:'Your Constellation',picked:'今回、あなたが見つけた星',insights:['あなたが惹かれやすいもの','大切にしている価値観','疲れている時に出やすい反応','今の自分への小さなヒント'],overlap:'あなたの星の重なり',familyLead:'この館で、あなたの星に近い親子は——',familyType:'Type {type} の親子',saveTitle:'星座をそばに置く',saveLead:'日常で静かに見返せる画像として保存できます。',wallpaper:'待ち受け版を保存',share:'シェア版を保存',paidLead:'ここで見えたのは、あなたの星座の輪郭です。\n絵や言葉、これまでの物語も重ねながら、もう少し深く自分を読み解きたい方へ。',paid:'私の星座を、もう少し深く読む',storyLead:'選んだ星の余韻を、言葉の物語でもう少し。',story:'星座の物語を読む',storySource:'noteで読む',restart:'もう一度、星を探す',tieBrand:'The Final Star',tieTitle:'最後の一星',tieLead:'同じ強さで光る星が残りました。今、もう少し心に近い言葉をひとつ選んでください。',constellationLabel:'あなたのタイプを表す星座',parentAlt:'Type {type}の親キャラ',kidAlt:'Type {type}のKidsキャラ',wallTitle:'あなたの中に見つけた星',wallNote:'今日の自分へ、小さな星のしるし。',shareNote:'{value}',downloadName:'sleeping-stars'},
    fields:[
      ['最初の星空',['より良くしたい','人を支えたい','形にしていきたい','自分だけの感覚','物事の本質','安心できる土台','新しい可能性','自分の意志','穏やかな時間']],
      ['心の奥の星空',['誠実でありたい','必要とされたい','成果を生み出す','余韻を味わう','静かに観察する','確かめてから進む','自由に広げる','大切なものを守る','調和を保つ']],
      ['日々を照らす星空',['丁寧に整える','気持ちに寄り添う','目標へ近づく','美しさを見つける','知識を深める','先を予測する','好奇心のままに','迷わず決める','一歩引いて見る']],
      ['人とつながる星空',['信頼に応える','あたたかなつながり','期待に応える','本当の自分でいる','ほどよい距離','信頼できる関係','楽しさを分かち合う','率直に向き合う','みんなが安心する']],
      ['立ち止まる夜の星空',['不完全さが気になる','自分を後回しにする','評価が気になる','足りなさを感じる','ひとりに戻りたい','何度も確認したい','次の楽しさを探す','弱さを見せたくない','決めるのを後回し']],
      ['これからへ続く星空',['少し力を抜く','自分の望みも聴く','何もしない時間','今ある輝きを見る','知を外へ開く','自分の判断を信じる','今ここに留まる','柔らかさを許す','自分の願いを選ぶ']],
      ['迷いの中の星空',['納得できる基準を探す','相手の気持ちを確かめる','前へ進める道を選ぶ','自分の本音に忠実でいたい','情報を集めて距離を置く','リスクを一つずつ確かめる','心が軽くなる可能性を選ぶ','自分で決めて引き受ける','波立たない着地点を探す']],
      ['光を取り戻す星空',['整った状態へ戻す','誰かと心を通わせる','手応えのある一歩を進める','感情を静かに味わう','ひとりで考える余白をつくる','安心できる手順を確かめる','新しい風に触れる','自分の力で流れを動かす','何もしない安らぎへ戻る']]
    ],
    types:{
      1:['改革する人','筋の通った考え方や、丁寧に整えられたもの。','誠実さ、責任、より良くしていくこと。','小さな乱れが気になり、自分にも周囲にも厳しくなりがちです。','今日は「十分よくできている」と認める余白をひとつ。','納得できる正しさへ向かう'],
      2:['与える人','心が通う関係や、誰かの役に立てる場面。','思いやり、つながり、相手を大切にすること。','人を優先しすぎて、自分の疲れや望みが見えにくくなります。','誰かに向ける優しさを、今日は自分にも少し。','心が通い合う温かさを選ぶ'],
      3:['達成する人','目標、成長、成果が目に見える挑戦。','前進すること、期待に応えること、価値を形にすること。','立ち止まる不安から、さらに予定や努力を重ねやすくなります。','成果とは関係のない時間にも、あなたの価値はあります。','手応えのある前進を選ぶ'],
      4:['個性的な人','深い感情、美しい余韻、自分にしか見えない景色。','本物であること、独自性、心の深さ。','人と比べて、自分にないものへ意識が向きやすくなります。','欠けているものより、すでに宿っている色をひとつ見つけて。','自分だけの本音と余韻を選ぶ'],
      5:['観察する人','静かな時間、奥行きのある知識、仕組みを理解すること。','自立、洞察、十分に考えてから動くこと。','人や出来事から距離を取り、頭の中だけで整理しようとしがちです。','完成していなくても、知っていることを小さく外へ開いてみて。','静かに理解を深める余白を選ぶ'],
      6:['忠実な人','信頼できる人や場所、見通しの立つ道筋。','安全、誠実さ、責任を果たすこと。','心配な点を何度も確かめ、自分の判断を疑いやすくなります。','すでに確かめ終えたことを一つ、自分に任せてみましょう。','確かな安心と信頼を選ぶ'],
      7:['熱中する人','新鮮な体験、自由な発想、まだ見ぬ可能性。','楽しさ、選択肢、未来が開けていること。','重さから離れるため、次の予定や刺激へ気持ちが移りやすくなります。','次へ急ぐ前に、今の喜びをもう一口味わって。','心がひらく新しい可能性を選ぶ'],
      8:['挑戦する人','率直さ、決断力、自分の力で動かせる状況。','強さ、公正さ、大切なものを守ること。','主導権を手放しにくくなり、言葉や態度が強く出やすくなります。','信頼できる相手に、小さな本音を預けることも強さです。','自分で決めて守る力を選ぶ'],
      9:['平和をもたらす人','穏やかな空気、自然なつながり、安心できる日常。','調和、安定、誰もが居心地よくいられること。','自分の優先順位が曖昧になり、決断を後へ延ばしやすくなります。','小さなことで大丈夫。今日は自分の希望を先に一つ選んで。','みんなが安らげる調和を選ぶ']
    },
    blend:'Type {first}「{firstName}」の星を中心に、Type {second}「{secondName}」の感覚も重なっています。ひとつの型への断定ではなく、今のあなたに表れている星の輪郭として眺めてみてください。'
  };

  const en={
    meta:{lang:'en',title:'Sleeping Stars v2 | Discover the constellation within you',description:'A quiet three-to-five-minute journey through eight star fields. Choose the words that glow for you and discover your constellation.'},
    ui:{subhead:'A Journey into Your Stars',lead:'Come find the stars resting quietly within you.',detail:'Beyond the night sky stands a house shared by nine families. As you gather the words that linger, the values and longings shaping this moment begin to form a constellation of your own.',introAlt:'Lune and Pico guiding the entrance among stars and lantern light',meta:['3–5 minutes','No sign-up','Free result'],start:'Begin the stargazing journey',notice:'This experience does not define you as a fixed type.\nIt offers a quiet way to notice the patterns present in you today.',choiceGuide:'Some nights, one star shines most clearly. On others, several remain. Choose one to three words that feel close to you now.',found:'Stars found',back:'Back',next:'To the next sky',see:'See my constellation',resultBrand:'Your Constellation',picked:'The stars you found',insights:['What draws you in','What you hold dear','What may surface when you are tired','A small note for where you are now'],overlap:'How your stars overlap',familyLead:'In the house, the family closest to your stars is—',familyType:'A Type {type} family',saveTitle:'Keep your constellation close',saveLead:'Save a quiet image to return to in everyday life.',wallpaper:'Save phone wallpaper',share:'Save share card',paidLead:'What you see here is the outline of your constellation.\nIf you would like to explore it through images, words, and the story that brought you here:',paid:'Read my constellation more deeply',storyLead:'Stay with the afterglow through stories and reflections.',story:'Read the stories behind the stars',storySource:'Read on Medium',restart:'Look for the stars again',tieBrand:'The Final Star',tieTitle:'One Last Star',tieLead:'A few stars are still shining with equal strength. Choose the one phrase that feels a little closer now.',constellationLabel:'The constellation for your result',parentAlt:'Type {type} parent character',kidAlt:'Type {type} kid character',wallTitle:'The stars you found within',wallNote:'A small constellation for where you are today.',shareNote:'{value}',downloadName:'sleeping-stars'},
    fields:[
      ['The First Sky',['Making things better','Being there for others','Turning ideas into results','A feeling uniquely mine','What lies beneath','A ground I can trust','New possibilities','My own will','Quiet, peaceful time']],
      ['The Inner Sky',['Living with integrity','Feeling needed','Creating something real','Lingering with a feeling','Watching in stillness','Checking before I move','Keeping my options open','Protecting what matters','Keeping the harmony']],
      ['The Everyday Sky',['Putting things in order','Meeting someone with care','Moving closer to a goal','Noticing beauty','Going deeper into knowledge','Thinking ahead','Following my curiosity','Making a clear decision','Taking a step back']],
      ['The Sky Between Us',['Being worthy of trust','A warm connection','Living up to expectations','Being true to myself','Comfortable distance','Relationships I can rely on','Sharing the joy','Meeting things head-on','A space where everyone can breathe']],
      ['The Sky on a Tired Night',['Noticing every imperfection','Putting myself last','Wondering how I am seen','Feeling that something is missing','Needing to retreat','Checking one more time','Looking for the next bright thing','Hiding my softer side','Putting the decision off']],
      ['The Sky Ahead',['Loosening my grip','Listening to what I want','Letting myself simply be','Seeing the light already here','Sharing what I know','Trusting my own judgment','Staying with this moment','Allowing gentleness','Choosing my own wish']],
      ['The Sky of Uncertainty',['Finding a standard I can stand behind','Checking how the other person feels','Choosing the path that moves things forward','Staying true to what I really feel','Gathering information and stepping back','Checking each risk one by one','Choosing the possibility that feels lighter','Deciding for myself and carrying it through','Looking for a landing place that keeps the peace']],
      ['The Sky That Restores Your Light',['Returning things to a clear order','Sharing a true moment with someone','Taking a step that feels worthwhile','Sitting quietly with what I feel','Making room to think on my own','Confirming a path that feels safe','Letting in a breath of something new','Moving the current with my own strength','Returning to the ease of doing nothing']]
    ],
    types:{
      1:['The Reformer','Clear principles, thoughtful order, and things made with care.','Integrity, responsibility, and the wish to make things better.','Small imperfections stand out, and you may become harder on yourself and others.','Make room for one quiet thought today: this may already be good enough.','Choose what feels honest and right.'],
      2:['The Helper','Warm connection and moments when your care can truly help someone.','Kindness, closeness, and making people feel held.','You may keep giving until your own needs and weariness fade from view.','Offer a little of the kindness you give so freely to yourself today.','Choose the warmth of a real connection.'],
      3:['The Achiever','Goals, growth, and challenges that turn effort into something visible.','Moving forward, answering expectations, and bringing value into form.','The unease of stopping may lead you to add one more task or push a little harder.','Your worth is still here in the moments when nothing is being achieved.','Choose the step that brings real momentum.'],
      4:['The Individualist','Deep feeling, beautiful afterglow, and landscapes only you seem to notice.','Authenticity, individuality, and emotional depth.','Comparison can draw your eyes toward what seems to be missing in you.','Notice one color or gift that is already alive within you.','Choose the feeling that is unmistakably yours.'],
      5:['The Observer','Quiet time, layered knowledge, and understanding how things work.','Independence, insight, and having enough space to think.','You may step away from people and events, trying to resolve everything in your mind.','Before it feels complete, let one small piece of what you know move into the world.','Choose the quiet space where understanding deepens.'],
      6:['The Loyalist','Trustworthy people, steady places, and paths with enough light to see ahead.','Safety, loyalty, and following through on what matters.','You may keep checking for risk until your own judgment becomes hard to hear.','Choose one thing you have checked enough, and let yourself trust it.','Choose the ground that feels steady and trustworthy.'],
      7:['The Enthusiast','Fresh experiences, open-ended ideas, and possibilities not yet explored.','Freedom, delight, and knowing another door can still open.','To move away from heaviness, your attention may leap toward the next bright plan.','Before you hurry onward, stay for one more taste of the joy that is here.','Choose the possibility that opens your heart.'],
      8:['The Challenger','Candor, decisive energy, and situations where you can make a difference.','Strength, fairness, and protecting what matters.','It can become hard to loosen your hold, and your words may land more forcefully.','Letting someone trustworthy hold one honest feeling can also be strength.','Choose the strength to decide and protect.'],
      9:['The Peacemaker','Gentle atmospheres, natural connection, and the comfort of familiar rhythms.','Harmony, steadiness, and making room for everyone to feel at ease.','Your own priorities may blur, making it easier to postpone a choice.','It can be something small. Let one of your own wishes go first today.','Choose the harmony where everyone can breathe.']
    },
    blend:'Type {first}, {firstName}, forms the center of this constellation, with a quieter echo of Type {second}, {secondName}. This is not a fixed label, but an outline of the patterns shining most clearly in you today.'
  };

  const ko={
    meta:{lang:'ko',title:'Sleeping Stars v2 | 마음에 머무는 말로 찾는 나의 별자리',description:'여덟 개의 별하늘을 지나며 마음에 남는 말을 고르는 3~5분의 조용한 자기이해 여정입니다.'},
    ui:{subhead:'A Journey into Your Stars',lead:'당신 안에 잠든 별을 찾으러 가요.',detail:'밤하늘 너머의 저택에는 아홉 유형의 가족이 함께 살고 있습니다. 마음에 머무는 말을 모으다 보면, 지금 당신이 끌리는 것과 소중히 여기는 가치가 하나의 별자리로 떠오릅니다.',introAlt:'별과 랜턴 사이에서 여행의 입구를 안내하는 Lune과 Pico',meta:['3~5분','가입 불필요','결과 무료'],start:'별을 찾으러 가기',notice:'이 경험은 당신을 하나의 유형으로 단정하지 않습니다.\n지금 당신 안에 드러나는 경향을 조용히 바라보는 시간입니다.',choiceGuide:'하나의 별만 선명하게 빛나는 밤도, 여러 별이 마음에 남는 밤도 있습니다. 지금 마음에 가까운 말을 1~3개 골라 주세요.',found:'찾은 별',back:'뒤로',next:'다음 별하늘로',see:'나의 별자리 보기',resultBrand:'Your Constellation',picked:'이번에 당신이 찾은 별',insights:['당신이 끌리는 것','소중히 여기는 가치','지쳤을 때 나타나기 쉬운 반응','지금의 나에게 건네는 작은 힌트'],overlap:'당신의 별이 겹치는 모습',familyLead:'이 저택에서 당신의 별과 가장 가까운 가족은—',familyType:'Type {type} 가족',saveTitle:'별자리를 곁에 두기',saveLead:'일상에서 조용히 다시 볼 수 있는 이미지로 저장할 수 있습니다.',wallpaper:'휴대폰 배경화면 저장',share:'공유 카드 저장',paidLead:'여기에서 보인 것은 당신 별자리의 윤곽입니다.\n그림과 말, 지금까지의 이야기를 더해 조금 더 깊이 자신을 읽어 보고 싶다면:',paid:'나의 별자리를 조금 더 깊이 읽기',storyLead:'선택한 별의 여운을 이야기와 사유 속에서 조금 더 이어가 보세요.',story:'별자리 이야기를 더 읽어보기',storySource:'note에서 읽기',restart:'다시 별을 찾기',tieBrand:'The Final Star',tieTitle:'마지막 별 하나',tieLead:'같은 밝기로 빛나는 별이 남았습니다. 지금 마음에 조금 더 가까운 말을 하나 골라 주세요.',constellationLabel:'결과 유형을 나타내는 별자리',parentAlt:'Type {type} 부모 캐릭터',kidAlt:'Type {type} Kids 캐릭터',wallTitle:'내 안에서 찾은 별',wallNote:'오늘의 나를 위한 작은 별의 표시.',shareNote:'{value}',downloadName:'sleeping-stars'},
    fields:[
      ['첫 번째 별하늘',['더 나아지게 하고 싶다','누군가를 돕고 싶다','결과로 만들어 내고 싶다','나만의 감각','사물의 본질','안심할 수 있는 토대','새로운 가능성','나의 의지','평온한 시간']],
      ['마음 깊은 곳의 별하늘',['진실하고 싶다','필요한 사람이 되고 싶다','성과를 만들어 내다','여운을 천천히 느끼다','조용히 관찰하다','확인한 뒤 나아가다','자유롭게 펼치다','소중한 것을 지키다','조화를 지키다']],
      ['일상을 비추는 별하늘',['정성스럽게 정돈하다','마음에 다가가다','목표에 가까워지다','아름다움을 발견하다','지식을 깊게 하다','앞을 내다보다','호기심을 따라가다','망설이지 않고 결정하다','한걸음 물러서 바라보다']],
      ['사람과 이어지는 별하늘',['신뢰에 보답하다','따뜻한 연결','기대에 부응하다','진짜 나로 있다','편안한 거리','믿을 수 있는 관계','즐거움을 나누다','솔직하게 마주하다','모두가 안심할 수 있게 하다']],
      ['멈춰 선 밤의 별하늘',['불완전함이 신경 쓰이다','나를 뒤로 미루다','평가가 마음에 걸리다','무언가 부족하다고 느끼다','혼자 있는 곳으로 돌아가고 싶다','몇 번이고 다시 확인하다','다음 즐거움을 찾다','약한 모습을 보이고 싶지 않다','결정을 뒤로 미루다']],
      ['앞으로 이어지는 별하늘',['조금 힘을 빼다','내가 원하는 것도 듣다','아무것도 하지 않는 시간','이미 있는 빛을 바라보다','아는 것을 밖으로 나누다','나의 판단을 믿다','지금 이 순간에 머물다','부드러움을 허락하다','나의 바람을 선택하다']],
      ['망설임 속의 별하늘',['납득할 수 있는 기준을 찾다','상대의 마음을 확인하다','앞으로 나아갈 길을 고르다','나의 진심에 충실하고 싶다','정보를 모으며 거리를 두다','위험을 하나씩 확인하다','마음이 가벼워지는 가능성을 고르다','스스로 결정하고 감당하다','평온한 결말을 찾다']],
      ['빛을 되찾는 별하늘',['정돈된 상태로 돌아가다','누군가와 진심을 나누다','보람이 느껴지는 한걸음을 내딛다','감정을 조용히 느끼다','혼자 생각할 여백을 만들다','안심할 수 있는 절차를 확인하다','새로운 바람을 맞다','나의 힘으로 흐름을 움직이다','아무것도 하지 않는 편안함으로 돌아가다']]
    ],
    types:{
      1:['개혁하는 사람','분명한 원칙과 정성스럽게 정돈된 것에 끌립니다.','성실함, 책임, 더 나아지게 하는 일을 소중히 여깁니다.','작은 흐트러짐이 크게 보이고 자신과 주변에 엄격해지기 쉽습니다.','오늘은 “이만하면 충분히 잘했다”는 여백을 하나 남겨 보세요.','납득할 수 있는 올바름을 향해 가기'],
      2:['돕는 사람','마음이 통하는 관계와 누군가에게 도움이 되는 순간에 끌립니다.','다정함, 연결, 상대를 소중히 대하는 일을 중요하게 여깁니다.','다른 사람을 먼저 챙기다 자신의 피로와 바람을 놓치기 쉽습니다.','다른 사람에게 건네는 다정함을 오늘은 자신에게도 조금 주세요.','마음이 이어지는 따뜻함을 선택하기'],
      3:['성취하는 사람','목표와 성장, 노력이 눈에 보이는 결과가 되는 도전에 끌립니다.','앞으로 나아가고 기대에 응하며 가치를 형태로 만드는 일을 소중히 여깁니다.','멈추는 것이 불안해 일정과 노력을 더 얹기 쉽습니다.','아무것도 이루지 않는 순간에도 당신의 가치는 그대로 있습니다.','손에 잡히는 전진을 선택하기'],
      4:['개성적인 사람','깊은 감정과 아름다운 여운, 자신만이 보는 풍경에 끌립니다.','진실한 나, 고유함, 마음의 깊이를 소중히 여깁니다.','비교 속에서 자신에게 없는 것만 바라보기 쉽습니다.','부족한 것보다 이미 당신 안에 살아 있는 색을 하나 찾아보세요.','나만의 진심과 여운을 선택하기'],
      5:['관찰하는 사람','조용한 시간과 깊이 있는 지식, 구조를 이해하는 일에 끌립니다.','독립성, 통찰, 충분히 생각할 수 있는 공간을 소중히 여깁니다.','사람과 사건에서 물러나 모든 것을 머릿속에서만 정리하려 하기 쉽습니다.','완성되지 않았어도 아는 것의 작은 한 조각을 밖으로 열어 보세요.','이해가 깊어지는 조용한 여백을 선택하기'],
      6:['충실한 사람','믿을 수 있는 사람과 장소, 앞이 보이는 길에 끌립니다.','안전, 성실함, 책임을 다하는 일을 소중히 여깁니다.','걱정되는 점을 거듭 확인하다 자신의 판단을 의심하기 쉽습니다.','이미 충분히 확인한 한 가지를 오늘은 자신에게 맡겨 보세요.','확실한 안심과 신뢰를 선택하기'],
      7:['열중하는 사람','새로운 경험과 자유로운 생각, 아직 열리지 않은 가능성에 끌립니다.','즐거움, 선택지, 미래가 열려 있다는 감각을 소중히 여깁니다.','무거움에서 벗어나려 마음이 다음 계획과 자극으로 옮겨가기 쉽습니다.','다음으로 서두르기 전에 지금의 기쁨을 한 번 더 맛보세요.','마음이 열리는 가능성을 선택하기'],
      8:['도전하는 사람','솔직함과 결단력, 자신의 힘으로 움직일 수 있는 상황에 끌립니다.','강함, 공정함, 소중한 것을 지키는 일을 중요하게 여깁니다.','주도권을 놓기 어려워 말과 태도가 강해지기 쉽습니다.','믿을 수 있는 사람에게 작은 진심을 맡기는 것도 강함입니다.','스스로 결정하고 지키는 힘을 선택하기'],
      9:['평화를 만드는 사람','부드러운 분위기와 자연스러운 연결, 편안한 일상에 끌립니다.','조화, 안정, 모두가 편안할 수 있는 공간을 소중히 여깁니다.','자신의 우선순위가 흐려져 결정을 뒤로 미루기 쉽습니다.','아주 작은 것이어도 괜찮습니다. 오늘은 나의 바람 하나를 먼저 골라 보세요.','모두가 숨 쉴 수 있는 조화를 선택하기']
    },
    blend:'Type {first} “{firstName}”의 별을 중심으로 Type {second} “{secondName}”의 감각도 조용히 겹쳐 있습니다. 하나의 틀로 단정하기보다 지금 당신 안에서 가장 선명하게 빛나는 경향의 윤곽으로 바라봐 주세요.'
  };

  window.SS_DATA={common,locales:{ja,en,ko}};
})();
