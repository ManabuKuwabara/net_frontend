import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';

const Page = () => {
  const networkRef = useRef(null);
  const [Network, setNetwork] = useState(null);
  const [DataSet, setDataSet] = useState(null);

  useEffect(() => {
    // vis-networkの動的インポート
    import('vis-network/standalone/esm/vis-network').then(vis => {
      setNetwork(() => vis.Network);
      setDataSet(() => vis.DataSet);
    });
  }, []);

  useEffect(() => {
    if (Network && DataSet && networkRef.current) {
      const fetchConnections = async () => {
        const response = await fetch('https://tech0-gen-5-step4-studentwebapp-12.azurewebsites.net/connections/');
        const connections = await response.json();

        const nodes = new DataSet();
        const edges = new DataSet();

        const departmentColors = {
          '本社営業第一課': '#008000', // 緑
          '資材課': '#FFD700', // ゴールド
          '品質管理課': '#FFA500', // オレンジ
          '品質保証課': '#FF4500', // オレンジレッド
          'マーケティング部': '#800080', // 紫
          'システム管理課': '#0000FF', // 青
          'システム開発課': '#00008B', // ダークブルー
          '経営企画部': '#B8860B', // ダークゴールデンロッド
          '経理部': '#0099CC', // 濃い水色
          '財務部': '#8B0000', // ダークレッド
          '人事部': '#2E8B57', // シーグリーン
          '総務部': '#4682B4', // スチールブルー
          '法務部': '#D2691E', // チョコレート
          'インキュベーション室': '#4B0082' // インディゴ
        };

        connections.forEach(conn => {
          if (!nodes.get(conn.Source)) {
            nodes.add({
              id: conn.Source,
              label: conn.Source,
              color: departmentColors[conn.SourceDepartment] || '#CCCCCC',
              font: {
                color: 'white' // ラベルの文字色を白に設定
              },
              title: conn.SourceDepartment // カーソルがノード上にあるときに表示されるツールチップ
            });
          }
          if (!nodes.get(conn.Target)) {
            nodes.add({
              id: conn.Target,
              label: conn.Target,
              color: departmentColors[conn.TargetDepartment] || '#CCCCCC',
              font: {
                color: 'white' // ラベルの文字色を白に設定
              },
              title: conn.TargetDepartment // カーソルがノード上にあるときに表示されるツールチップ
            });
          }
          edges.add({
            from: conn.Source,
            to: conn.Target,
            width: conn.Weight,
            clicked: false // クリックしたエッジを識別するフラグを追加
          });
        });

        // ネットワークを描画するためのオプション
        const options = {
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -2000,  // 重力定数を調整
              centralGravity: 0.3,  // 中心への引力
              springLength: 100,  // リンクの長さ
              springConstant: 0.05,  // リンクの強度
              damping: 0.09,  // 減衰率（動きを抑える）
              avoidOverlap: 0.1  // 重なりを避ける
            },
            stabilization: {
              enabled: true,
              iterations: 1000  // 安定化のための反復処理回数を増やす
            }
          },
          edges: {
            color: {
              color: '#CCCCCC',
              highlight: '#FF0000'
            },
            smooth: {
              type: 'continuous'
            }
          }
        };
        
        // ネットワークを描画
        const container = networkRef.current;
        const data = { nodes, edges };
        new Network(container, data, options);
      };

      fetchConnections();
    }
  }, [Network, DataSet]);

  return (
    <Layout> {/* 新しいコンポーネントを使用 */}
      <div ref={networkRef} style={{ width: '1000px', height: '800px' }} />
    </Layout>
  );
};

export default Page;
