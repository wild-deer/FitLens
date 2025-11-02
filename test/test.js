async function main({ params }) {
    // 构建输出对象
    // params.scenes 是 Array<Object>，子项是 scene_name(String)，visual_description(String)
    
    // 将场景数组拼接为字符串
    const scenesText = params.scenes
        .map((scene, index) => {
            // 场景概念一、场景概念二等序号
            const conceptNum = `场景概念${index + 1}`;
            return `${conceptNum}：场景名称 是${scene.scene_name} ，视觉元素为${scene.visual_description}。`;
        })
        .join('\n'); // 多个场景用换行符连接，如果需要其他分隔符可以修改
    
    return scenesText;
}

// 示例用法
// const params = {
//     scenes: [
//         { scene_name: "健身房", visual_description: "器械、哑铃、跑步机" },
//         { scene_name: "户外跑步", visual_description: "跑道、运动鞋、阳光" }
//     ]
// };
// main({ params }).then(result => console.log(result));
