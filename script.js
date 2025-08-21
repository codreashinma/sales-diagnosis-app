document.addEventListener('DOMContentLoaded', () => {
    const salesForm = document.getElementById('salesForm');
    const resultContainer = document.getElementById('resultContainer');
    const scoreValue = document.getElementById('scoreValue');
    const scoreLevel = document.getElementById('scoreLevel');
    const feedback = document.getElementById('feedback');
    const retryBtn = document.getElementById('retryBtn');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const questions = document.querySelectorAll('.question');
    
    // 質問の総数
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;

    // 初期表示は最初の質問のみ
    showCurrentQuestion();

    // 各質問のラジオボタンにイベントリスナーを追加
    questions.forEach((question, index) => {
        const radioButtons = question.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                // 少し遅延を入れて次の質問に移動
                setTimeout(() => {
                    if (index < totalQuestions - 1) {
                        currentQuestionIndex = index + 1;
                        showCurrentQuestion();
                        updateProgressBar();
                    }
                }, 300);
            });
        });
    });

    // フォーム送信時の処理
    salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 各質問の点数を集計
        let totalScore = 0;
        for (let i = 1; i <= 9; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                totalScore += parseInt(selectedOption.value);
            }
        }
        
        // 18点満点を100点満点に換算
        const score100 = Math.round((totalScore / 18) * 100);
        
        // 結果を表示
        showResult(score100);
    });

    // 「もう一度診断する」ボタンのクリック時の処理
    retryBtn.addEventListener('click', () => {
        salesForm.reset();
        salesForm.style.display = 'block';
        resultContainer.classList.add('hidden');
        currentQuestionIndex = 0;
        showCurrentQuestion();
        updateProgressBar();
    });

    // 現在の質問を表示する関数
    function showCurrentQuestion() {
        questions.forEach((question, index) => {
            if (index === currentQuestionIndex) {
                question.style.display = 'block';
                question.classList.add('active-question');
            } else {
                question.style.display = 'none';
                question.classList.remove('active-question');
            }
        });
        
        // 最後の質問の場合は送信ボタンを表示
        const submitBtn = document.getElementById('submitBtn');
        if (currentQuestionIndex === totalQuestions - 1) {
            submitBtn.style.display = 'block';
        } else {
            submitBtn.style.display = 'none';
        }
    }

    // プログレスバーの更新
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `質問 ${currentQuestionIndex + 1}/${totalQuestions}`;
    }

    // 結果表示の関数
    function showResult(score) {
        // スコア表示（アニメーション付き）
        animateScore(0, score);
        
        // レベル判定
        let level;
        let feedbackText;
        
        if (score >= 90) {
            level = 'S (エキスパート)';
            feedbackText = `
                <h3>素晴らしい営業力です！</h3>
                <p>あなたは営業プロセスを完全に理解し、実践できています。目標設定、見込み客の獲得、商談、フォローアップのすべての面で優れた結果を出しています。</p>
                <h4>さらなる成長のために：</h4>
                <ul>
                    <li>他のチームメンバーへの知識共有やメンタリングを行いましょう</li>
                    <li>より複雑な案件や大型案件にチャレンジしましょう</li>
                    <li>業界のトレンドを先取りし、新しい営業手法を開発しましょう</li>
                </ul>
            `;
        } else if (score >= 70) {
            level = 'A (プロフェッショナル)';
            feedbackText = `
                <h3>高い営業力を持っています</h3>
                <p>あなたは営業プロセスをしっかりと実践できています。多くの面で優れた結果を出していますが、さらなる向上の余地があります。</p>
                <h4>成長のためのアドバイス：</h4>
                <ul>
                    <li>成約率をさらに高めるための商談スキルの向上に取り組みましょう</li>
                    <li>既存顧客からのリピート・紹介を増やす施策を考えましょう</li>
                    <li>時間管理を最適化し、より多くの見込み客と接触しましょう</li>
                </ul>
            `;
        } else if (score >= 50) {
            level = 'B (スタンダード)';
            feedbackText = `
                <h3>基本的な営業力は身についています</h3>
                <p>営業の基本は理解していますが、一貫性や効率性に改善の余地があります。</p>
                <h4>改善のためのアドバイス：</h4>
                <ul>
                    <li>明確な売上目標を設定し、それを達成するための行動計画を立てましょう</li>
                    <li>週あたりの商談数を増やす努力をしましょう</li>
                    <li>最新の商品・事例情報を積極的に学び、商談に活用しましょう</li>
                    <li>報連相の回数を増やし、上司や同僚からのアドバイスを受けましょう</li>
                </ul>
            `;
        } else {
            level = 'C (ビギナー)';
            feedbackText = `
                <h3>営業プロセスの基礎から見直しましょう</h3>
                <p>営業活動に改善の余地が大きくあります。基本的な営業プロセスを学び直し、実践することで成果を上げることができるでしょう。</p>
                <h4>改善のためのアドバイス：</h4>
                <ul>
                    <li>具体的な月間売上目標を設定しましょう</li>
                    <li>見込み客リストを作成し、計画的にアプローチしましょう</li>
                    <li>週に最低2回は商談の機会を作りましょう</li>
                    <li>商品知識を深め、お客様のニーズに合った提案ができるようにしましょう</li>
                    <li>上司に相談し、営業スキル向上のためのアドバイスを受けましょう</li>
                </ul>
            `;
        }
        
        // 結果を表示
        scoreLevel.textContent = `レベル：${level}`;
        feedback.innerHTML = feedbackText;
        
        // フォームを隠して結果を表示
        salesForm.style.display = 'none';
        resultContainer.classList.remove('hidden');
    }
    
    // スコアをアニメーションさせる関数
    function animateScore(start, end) {
        const duration = 1500;
        const startTime = performance.now();
        
        function updateScore(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeOutQuart(progress);
            const currentScore = Math.floor(start + (end - start) * easeProgress);
            
            scoreValue.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(updateScore);
            }
        }
        
        requestAnimationFrame(updateScore);
    }
    
    // イージング関数
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    
    // 初期化時にプログレスバーを更新
    updateProgressBar();
});